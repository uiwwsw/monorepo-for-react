import { Service } from '../service';
import { Redis } from 'ioredis';
import logger from '../libs/logger';
import { MsgQueueRow,  } from '../model/R301';
import { ITaskTransferInfo } from '../model/taskTransferInfo';
import { ITcsEventSet } from '../model/tcsEventSet';

class TransItem {
    public No : number;
    public Query!: string;
    public Params!: unknown[];
    public constructor(no : number, query:string, params:unknown[] = []) {
        this.No = no;
        this.Query = query;
        this.Params = params;
    }
}

export class DBM {
    private subs!: Redis;
    private transList:TransItem[] = [];

    public constructor(redis:Redis) {
        this.subs = redis;

        this.subs.on('message', (channel, message) => {
            this.onRecvMessage(channel, message);
        });

        this.subs.on('pmessage', (pattern, channel, message) => {
            this.onRecvMessage(channel, message);
        });

        this.subs.subscribe('AlarmEventCh');
        this.subs.subscribe('AlarmEventCh');
        this.subs.subscribe('TransferInfoCh');
        this.subs.subscribe('UIMCh');
        this.subs.subscribe('Logs');
        this.subs.psubscribe('TCMZoneCh:*');

        process.nextTick(async () => {
            await this.checkSkip();

            this.run();
        });
    }

    // Redis에 등록되어 있는데, MySQL에 등록되지 않은 TaskTransferInfo 정보를 등록 함
    private async checkSkip() {
        try {
            const keys = await Service.Inst.Redis.keys('TransferInfo:*[0-9]');
            const params = [];
            for (let i=0, iLen=keys.length; i<iLen; i++) {
                const key = keys[i];
                const task = await Service.Inst.Redis.hmget(
                    key,
                    'Location',
                    'From',
                    'CarrierID',
                    'State',
                    'CommandID',
                    'To',
                    'Junctions'
                );
                if (task[0] == null) {
                    continue;
                }
                params.push({
                    taskID : key.substring(13),
                    zoneIDFrom : task[1],
                    carrierID : task[2],
                    commandID : task[4],
                    ZoneIDTo : task[5],
                }, task[1], task[2], task[4], task[5]);
            }
            const conn = await Service.Inst.MySQL.getConnection();
            try {
                await conn.beginTransaction();
                for(let i=0, iLen=params.length; i<iLen; i++) {
                    const param = params[i];
                    await conn.query('insert into taskTransferInfo set ? ON DUPLICATE KEY UPDATE zoneIdFrom = ?, carrierId = ?, commandId = ?, zoneIdTo = ?', param);
                }
                await conn.commit();
            } catch (ex) {
                logger.error(ex as Error);
                await conn.rollback();
            } finally {
                await conn.end();
            }
        } catch (ex) {
            logger.error(ex as Error);
        }
    }

    // Redis 메시지 수신 이벤트 처리
    private async onRecvMessage(channel:string, message:string) {
        logger.debug(`Received the following message from ${channel}: ${message}`);
        await Service.Inst.MySQL.query('INSERT INTO MsgQueue SET ?', { State : 1, Date : new Date(), Channel : channel, Message : message });
    }

    // 메시지 처리 루프
    private async run() {
        while(Service.Inst.IsRun) {
            try {
                const [rows] = await Service.Inst.MySQL.query<MsgQueueRow[]>('SELECT * FROM MsgQueue WHERE State = 1 LIMIT 100');
                if (rows.length < 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }
                this.transList = [];
                for(let i=0, iLen=rows.length; i<iLen; i++) {
                    const row = rows[i];
                    try {
                        await Service.Inst.MySQL.query('UPDATE MsgQueue SET State = 2 WHERE Id = ?', [row.No]);
                        this.processMessage(row);
                    } catch (ex) {
                        const err = ex as Error;
                        await Service.Inst.MySQL.query('UPDATE MsgQueue SET State = 9, Result = ? WHERE Id = ?', [err ? err.message.substring(0, 1000) : '', row.No]);        // 최대 1000 글자만 에러 메시지 저장
                    }
                }
                let result = false;
                if (this.transList.length > 0) {
                    const conn = await Service.Inst.MySQL.getConnection();
                    try {
                        await conn.beginTransaction();
                        for(let i=0, iLen=this.transList.length; i<iLen; i++) {
                            const trans = this.transList[i];
                            await conn.query(trans.Query, trans.Params);
                        }
                        await conn.commit();
                        result = true;
                    } catch (ex) {
                        logger.error(ex as Error);
                        await conn.rollback();
                    } finally {
                        await conn.end();
                    }
                    await Service.Inst.MySQL.query('delete from MsgQueue where State = 3');
                }
                if (result == false) {
                     // trasaction 처리가 실패 했을 경우, 개별로 처리를 실행 함,,
                    await this.eachTransQuery();
                }
            } catch (ex) {
                logger.error(ex as Error);
            }
        }
    }

    // 트랜잭션 처리 실패 시 처리 절차,,
    private async eachTransQuery() {
        for(let i=0, iLen=this.transList.length; i<iLen; i++) {
            const trans = this.transList[i];
            try {
                await Service.Inst.MySQL.query(trans.Query, trans.Params);
                await Service.Inst.MySQL.query('delete from MsgQueue WHERE Id = ?', [trans.No]);
            } catch (ex) {
                const err = ex as Error;
                await Service.Inst.MySQL.query('UPDATE MsgQueue SET State = 9, Result = ? WHERE Id = ?', [err ? err.message.substring(0, 1000) : '', trans.No]);        // 최대 1000 글자만 에러 메시지 저장
            }
        }
    }

    // 각각의 메시지 처리,,
    private processMessage(row : MsgQueueRow) {
        const obj = JSON.parse(row.Message);
        const msg = obj.MessageData;
        switch(obj.MessageID) {
            case 'tcmAlarmSet':
                this.transList.push(new TransItem(row.No, 'insert into Alarminfo set ?', [{
                    serialNo: msg.SerialNumber,
                    alarmCode: msg.AlarmCode,
                    taskId: msg.TaskID,
                    location: msg.Location,
                    reason: msg.Reason,
                    commanId: msg.CommandID,
                    tcmid: msg.Location ? Math.floor(msg.Location / 100) : -1,
                    carrierId: msg.CarrierID,
                    setTime: row.Date,
                }]));
                break;
            case 'tcmAlarmCleared':
                this.transList.push(new TransItem(row.No, 'update Alarminfo set clearedTime = ? where serialNo = ? and clearedTime is null', [row.Date, msg.SerialNumber]));
                break;
            case 'tcmTransferInfo':
                {
                    const tcminfo: ITaskTransferInfo = msg.MessageData.Object;
                    if (tcminfo.State === 'READY') {
                        this.transList.push(new TransItem(row.No, 'insert into taskTransferInfo set ?', [{
                            taskID : tcminfo.TaskID,
                            zoneIDFrom : tcminfo.ZoneIDFrom ? tcminfo.ZoneIDFrom : null,
                            startTime : row.Date
                        }]));
                    } else if (tcminfo.ZoneIDTo) {
                        // DESTINATION UPDATE
                        this.transList.push(new TransItem(row.No, 'update taskTransferInfo set zoneIDTo = ? where taskID = ?', [tcminfo.ZoneIDTo, tcminfo.TaskID]));
                    }
                    this.transList.push(new TransItem(row.No, 'insert into tasktransferinfostatus set ?', [{
                        taskID : tcminfo.TaskID,
                        state : tcminfo.State || '',
                        zoneIdCurrent : tcminfo.ZoneIDCurrent || -1,
                        timeStamp : row.Date
                    }]));
                }
                break;
            case 'tcsEventSet':
                {
                    const tcmEvent: ITcsEventSet = msg.MessageData;
                    if (tcmEvent.CommandID) {
                        this.transList.push(new TransItem(row.No, 'update taskTransferInfo set commandId = ? where taskID = ?', [tcmEvent.CommandID, tcmEvent.TaskID]));
                    }
                }
                break;
            default:
                logger.error(`processMessage. Unknown message ID: ${obj.MessageID}`);
                break;
        }
    }
}
