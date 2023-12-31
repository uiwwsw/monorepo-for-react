import { Service } from '../service';
import { Redis } from 'ioredis';
import logger from '../libs/logger';
import { TaskTransferInfoRow, CompleteCarrierRow, DestinationZoneRow } from '../models/R301';
import { ITaskTransferInfoRow, ICompleteCarrierRow, IDestinationZoneRow } from '../types/R301';
import { TITAN_INTERNAL_EVENT_ID } from '../models/tcmEventId';
import { ITaskTransferInfo } from '../models/taskTransferInfo';
import { ITcsEventSet } from '../models/tcsEventSet';
import { IWarningInfo } from '../models/warningInfo';
import { IZoneDynamicattributes } from '../models/zoneDynamicattributes';
import { IZoneOccupiedAttributes } from '../models/zoneOccupiedAttributes';
import { e84BitStateNum } from '../models/e84BitStates';

class TransItem {
    public Query!: string;
    public Params!: unknown[];
    public constructor(query:string, params:unknown[] = []) {
        this.Query = query;
        this.Params = params;
    }
}

interface IMsgQueueRow {
    Date : Date;
    Channel : string;
    Message : string;
    Result : string;
}

export class DBM {
    private subs!: Redis;
    private queue!: Redis;
    private transList:TransItem[] = [];
    private taskTransferInfos:{[key:number]:ITaskTransferInfoRow} = {};
    private completeCarriers:{[key:number]:ICompleteCarrierRow} = {};
    private destinationZones:{[key:number]:IDestinationZoneRow} = {};
    private e84jobs:{[key:string]:Date} = {};

    public constructor(redis:Redis) {
        this.subs = redis;
        this.queue = Redis.createClient();      // Local Redis를 사용할 예정이라, 별도의 Redis를 사용

        process.nextTick(async () => {
            await this.checkSkip();
            await this.getTransferInfos();
            await this.getCompleteCarriers();
            await this.getDestinationZones();

            this.subs.subscribe('AlarmEventCh');
            this.subs.subscribe('AlarmEventCh');
            this.subs.subscribe('TransferInfoCh');
            this.subs.subscribe('UIMCh');
            this.subs.subscribe('Logs');
            this.subs.psubscribe('TCMZoneCh:*');

            this.subs.on('message', (channel, message) => {
                this.onRecvMessage(channel, message);
            });
    
            this.subs.on('pmessage', (pattern, channel, message) => {
                this.onRecvMessage(channel, message);
            });
    
            this.run();
        });
    }

    // Redis에 등록되어 있는데, MySQL에 등록되지 않은 TaskTransferInfo 정보를 등록
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
                params.push([{
                    taskID : key.substring(13),
                    zoneIDFrom : task[1],
                    carrierID : task[2],
                    commandID : task[4],
                    ZoneIDTo : task[5],
                    StartTime : new Date()
                }, task[1], task[2], task[4], task[5]]);
            }
            const conn = await Service.Inst.MySQL.getConnection();
            try {
                await conn.beginTransaction();
                for(let i=0, iLen=params.length; i<iLen; i++) {
                    const param = params[i];
                    await conn.query('insert into tasktransferinfo set ? ON DUPLICATE KEY UPDATE zoneIdFrom = ?, carrierId = ?, commandId = ?, zoneIdTo = ?', param);
                }
                await conn.commit();
            } catch (ex) {
                logger.error(ex as Error);
                await conn.rollback();
            } finally {
                await conn.release();
            }
        } catch (ex) {
            logger.error(ex as Error);
        }
    }

    // 진행 중인 Task가 있으면 캐슁
    private async getTransferInfos() {
        try {
            const [rows] = await Service.Inst.MySQL.query<TaskTransferInfoRow[]>('SELECT * FROM tasktransferinfo where EndTime is null');
            for(let i=0, iLen=rows.length; i<iLen; i++) {
                const row = rows[i];
                this.taskTransferInfos[row.taskID] = row;
            }
        } catch (ex) {
            logger.error(ex as Error);
        }
    }

    // 보관중인 CompleteCarrier 정보 캐슁
    private async getCompleteCarriers() {
        try {
            const [rows] = await Service.Inst.MySQL.query<CompleteCarrierRow[]>('SELECT * FROM completecarrier');
            for(let i=0, iLen=rows.length; i<iLen; i++) {
                const row = rows[i];
                this.completeCarriers[row.ZoneID] = row;
            }
        } catch (ex) {
            logger.error(ex as Error);
        }
    }

    // 보관중인 DestinationZone 정보 캐슁
    private async getDestinationZones() {
        try {
            const [rows] = await Service.Inst.MySQL.query<DestinationZoneRow[]>('SELECT * FROM destinationzone');
            for(let i=0, iLen=rows.length; i<iLen; i++) {
                const row = rows[i];
                this.destinationZones[row.ZoneID] = row;
            }
        } catch (ex) {
            logger.error(ex as Error);
        }
    }

    // Redis 메시지 수신 이벤트 처리
    private async onRecvMessage(channel:string, message:string) {
        let body = { Date : new Date(), Channel : channel, Message : message };
        this.queue.lpush('MsgQueue', JSON.stringify(body));
        //logger.debug(`Received the following message from ${channel}: ${message}`);
        //await Service.Inst.MySQL.query('INSERT INTO MsgQueue SET ?', { State : 1, Date : new Date(), Channel : channel, Message : message });
    }

    // 메시지 처리 루프
    private async run() {
        while(Service.Inst.IsRun) {
            try {
                const queueLen = await this.queue.llen('MsgQueue');
                if (queueLen < 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }
                logger.debug(`MsgQueue length: ${queueLen}`);
                const count = queueLen > 100 ? 100 : queueLen;
                this.transList = [];
                for(let i=0; i<count; i++) {
                    const json = await this.queue.rpop('MsgQueue');
                    if (!json) {
                        break;
                    }
                    try {
                        const row = JSON.parse(json) as IMsgQueueRow;
                        this.processMessage(row);
                    } catch (ex) {
                        const err = ex as Error;
                        logger.error(`run.processMessage. ${err.message}\n${err.stack}`);
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
                        await conn.release();
                    }
                }
                if (result == false) {
                     // trasaction 처리가 실패 했을 경우, 개별로 처리를 실행 함,,
                    await this.eachTransQuery();
                }

                // E84JobID가 있는 경우, 10분 이상 지난 경우 삭제
                const now = new Date();
                for (const key in this.e84jobs) {
                    if (this.e84jobs[key].getTime() + 600000 < now.getTime()) {
                        delete this.e84jobs[key];
                    }
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
            } catch (ex) {
                const err = ex as Error;
                logger.error(`eachTransQuery. query:${trans.Query}, ex:${err.message}\n${err.stack}`);
            }
        }
    }

    // 각각의 메시지 처리,,
    private processMessage(row : IMsgQueueRow) {
        const obj = JSON.parse(row.Message);
        const msg = obj.MessageData;
        switch(obj.MessageID) {
            case 'tcmAlarmSet':
                this.transList.push(new TransItem('insert into Alarminfo set ?', [{
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
                this.transList.push(new TransItem('update Alarminfo set clearedTime = ? where serialNo = ? and clearedTime is null', [row.Date, msg.SerialNumber]));
                break;
            case 'tcmTransferInfo':
                {
                    const tcminfo: ITaskTransferInfo = msg.Object;
                    if (tcminfo.State === 'READY') {
                        this.transList.push(new TransItem('insert into tasktransferinfo set ?', [{
                            taskID : tcminfo.TaskID,
                            zoneIDFrom : tcminfo.ZoneIDFrom ? tcminfo.ZoneIDFrom : null,
                            startTime : row.Date
                        }]));
                        this.taskTransferInfos[tcminfo.TaskID] = {
                            TaskID : tcminfo.TaskID,
                            ZoneIDFrom : tcminfo.ZoneIDFrom ? tcminfo.ZoneIDFrom : 0,
                            StartTime : row.Date,
                        };
                    } else if (tcminfo.ZoneIDTo) {
                        // DESTINATION UPDATE
                        this.transList.push(new TransItem('update tasktransferinfo set zoneIDTo = ? where taskID = ?', [tcminfo.ZoneIDTo, tcminfo.TaskID]));
                        this.taskTransferInfos[tcminfo.TaskID] && (this.taskTransferInfos[tcminfo.TaskID].ZoneIDTo = tcminfo.ZoneIDTo);
                    }
                    this.transList.push(new TransItem('insert into tasktransferinfostatus set ?', [{
                        taskID : tcminfo.TaskID,
                        state : tcminfo.State || '',
                        zoneIdCurrent : tcminfo.ZoneIDCurrent || -1,
                        timeStamp : row.Date
                    }]));
                }
                break;
            case 'tcsEventSet':
                {
                    const tcmEvent: ITcsEventSet = msg;
                    if (tcmEvent.CommandID && tcmEvent.CommandID.length > 0) {
                        this.transList.push(new TransItem('update tasktransferinfo set commandId = ? where taskID = ?', [tcmEvent.CommandID, tcmEvent.TaskID]));
                        this.taskTransferInfos[tcmEvent.TaskID] && (this.taskTransferInfos[tcmEvent.TaskID].CommandID = tcmEvent.CommandID);
                    }
                    this.handleEventLogs(tcmEvent, row);
                }
                break;
            case 'tcsLogsMessage':
                this.transList.push(new TransItem('insert into logs set ?', [{
                    TimeStamp: row.Date,
                    Level: msg.Level,
                    TCMID: msg.TCMID,
                    TaskID: msg.TaskID,
                    ZoneID: msg.ZoneID,
                    Comment: msg.Comment
                }]));
                break;
            case 'tcsWarningSet':
                {
                    const tcmWarning: IWarningInfo = msg;
                    this.transList.push(new TransItem('insert into warninginfo set ?', [{
                        serialNo: tcmWarning.SerialNo,
                        warningCode: tcmWarning.EventCode ? +tcmWarning.EventCode : -1,
                        taskId: +tcmWarning.TaskID,
                        location: tcmWarning.Location ? +tcmWarning.Location : -1,
                        reason: tcmWarning.Reason ? +tcmWarning.Reason : -1,
                        commandId: tcmWarning.CommandID,
                        carrierId: tcmWarning.CarrierID,
                        setTime: row.Date
                    }]));
                }
                break;
            case 'tcmZoneStateAttributes':
                {
                    const zone: IZoneDynamicattributes = msg.Object;
                    this.transList.push(new TransItem('insert into zonedynamicattributes set ?', [{
                        motorState: zone.MotorState,
                        state: zone.State,
                        prevState: zone.PrevState,
                        zoneId: zone.ZoneID,
                        timeStamp: row.Date,
                    }]));
                    this.saveE84States(zone, row);
                }
                break;
            case 'tcmZoneOccupiedAttributes':
                {
                    const occupiedInfo: IZoneOccupiedAttributes = msg.Object;
                    this.transList.push(new TransItem('insert into zoneoccupiedattributes set ?', [{
                        zoneId: occupiedInfo.ZoneID,
                        reservedTaskId: occupiedInfo.ReservedTaskID === -1 ? 0 : occupiedInfo.ReservedTaskID,
                        occupiedSensor1: occupiedInfo.OccupiedSensor1 ? +occupiedInfo.OccupiedSensor1 : -1,
                        occupiedSensor2: occupiedInfo.OccupiedSensor2 ? +occupiedInfo.OccupiedSensor2 : -1,
                        occupiedSensor3: occupiedInfo.OccupiedSensor3 ? +occupiedInfo.OccupiedSensor3 : -1,
                        currentDirection: occupiedInfo.CurrentDirection ? +occupiedInfo.CurrentDirection : -1,
                        currentLevel: occupiedInfo.CurrentLevel ? +occupiedInfo.CurrentLevel : -1,
                        alarmSerialNumber: +occupiedInfo.AlarmSerialNumber,
                        timeStamp: row.Date
                    }]));
                }
                break;
            default:
                logger.error(`processMessage. Unknown message ID: ${obj.MessageID}`);
                break;
        }
    }

    private handleEventLogs(tcmEvent: ITcsEventSet, row : IMsgQueueRow) {
        let comment = '';
        switch (tcmEvent.EventCode) {
            case TITAN_INTERNAL_EVENT_ID.EVENT_READ_RFID:
                this.transList.push(new TransItem('update tasktransferinfo set carrierId = ? where taskId = ?', [ tcmEvent.CarrierID, tcmEvent.TaskID ]));
                comment = `read RFID zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_CARRIER_INSTALLED:
                /**CARRIER ID 화인 될 경우 CARRIER ID UPDATE */
                this.transList.push(new TransItem('update tasktransferinfo set carrierId = ?, zoneIdFrom = ? where taskId = ?', [ tcmEvent.CarrierID, tcmEvent.Location, tcmEvent.TaskID ]));
                comment = `carrier installed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_ABORTED:
                /** MANUAL ABORT 할 경우 DB에 저장 */
                comment = `transfer aborted zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_COMPLETED:
                /** 이송 완료 될 경우 DB에 저장 */
                this.transList.push(new TransItem('update tasktransferinfo set zoneIdTo=?, endTime = ? where taskId = ?', [ tcmEvent.Location, row.Date, tcmEvent.TaskID ]));

                // CompleteCarrier, DestinationZone에 저장
                if (this.completeCarriers[tcmEvent.Location]) {
                    this.transList.push(new TransItem('update completecarrier set useCount = useCount + 1, timeStamp = ? where zoneId = ?', [ row.Date, tcmEvent.Location ]));
                } else {
                    this.transList.push(new TransItem('insert into completecarrier set ?', [ {
                        zoneId : tcmEvent.Location,
                        useCount : 1,
                        timeStamp : row.Date,
                    }]));
                    this.completeCarriers[tcmEvent.Location] = {
                        ZoneID : tcmEvent.Location,
                        UseCount : 1,
                        TimeStamp : row.Date,
                    };
                }
                if (this.destinationZones[tcmEvent.Location]) {
                    this.transList.push(new TransItem('update destinationzone set useCount = useCount + 1, timeStamp = ? where zoneId = ?', [ row.Date, tcmEvent.Location ]));
                } else {
                    this.transList.push(new TransItem('insert into destinationzone set ?', [ {
                        zoneId : tcmEvent.Location,
                        useCount : 1,
                        timeStamp : row.Date,
                    }]));
                    this.destinationZones[tcmEvent.Location] = {
                        ZoneID : tcmEvent.Location,
                        UseCount : 1,
                        TimeStamp : row.Date,
                    };
                }

                // CompleteCarrierCount에 저장
                this.transList.push(new TransItem('insert into completecarriercount set ?', [{
                    carrierId : this.taskTransferInfos[tcmEvent.TaskID] ? this.taskTransferInfos[tcmEvent.TaskID].CarrierID : 'UNKNOWN',
                    zoneId : tcmEvent.Location,
                    timeStamp : row.Date
                }]));
                delete this.taskTransferInfos[tcmEvent.TaskID];
                comment = `transfer completed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_INITIATED:
                comment = `transfer initiated zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_RESUMED:
                comment = `transfer resumed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_READ_RFID_FAILED:
                comment = `read RFID failed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_CARRIER_ARRIVED:
                comment = `carrier arrived zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_CARRIER_REMOVED:
                comment = `carrier removed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_CARRIER_ID_DUPLICATED:
                comment = `carrier ID duplicated zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_CARRIER_STORE_COMPLETED:
                comment = `carrier store completed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_TRANSFERRING:
                comment = `transfer transferring zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_PAUSED:
                comment = `transfer paused zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_CARRIER_DETECTED:
                comment = `carrier detected zone[${tcmEvent.Location}]`;
                break;
        }

        comment.length > 0 && this.transList.push(new TransItem('insert into logs set ?', [{
            TimeStamp: row.Date,
            Level: 0,
            EventCode : tcmEvent.EventCode,
            TCMID: tcmEvent.Location ? `${Math.floor(+tcmEvent.Location / 100)}` : `-1`,
            TaskID: tcmEvent.TaskID ? +tcmEvent.TaskID : -1,
            ZoneID: tcmEvent.Location,
            Comment: comment
        }]));
    }

    private async saveE84States(dynamicAttributes: IZoneDynamicattributes, row : IMsgQueueRow) {
        try {
            if (!dynamicAttributes.E84JobID || dynamicAttributes.E84JobID === -1 || dynamicAttributes.E84BitState === undefined) {
                logger.warn(`saveE84States. Invalid E84JobID: ${dynamicAttributes.E84JobID}`);
                return;
            }
            const E84JobID = `${dynamicAttributes.E84JobID}`;
            if (!this.e84jobs[E84JobID]) {
                this.e84jobs[E84JobID] = row.Date;
                this.transList.push(new TransItem('insert into E84Jobs set ? ON DUPLICATE KEY UPDATE startTime = startTime', [{
                    e84JobId: E84JobID,
                    zoneId: dynamicAttributes.ZoneID,
                    startTime: row.Date,
                }]));
            }
            const E84BitState = dynamicAttributes.E84BitState.split(',');
            this.transList.push(new TransItem('insert into E84JobStates set ?', [{
                e84JobId: E84JobID,
                sequenceState: dynamicAttributes.E84Sequence,
                L_REQ: E84BitState[e84BitStateNum.E84_BIT_L_REQ] === 'on' ? 1 : 0,
                U_REQ: E84BitState[e84BitStateNum.E84_BIT_U_REQ] === 'on' ? 1 : 0,
                READY: E84BitState[e84BitStateNum.E84_BIT_READY] === 'on' ? 1 : 0,
                HO_AVBL: E84BitState[e84BitStateNum.E84_BIT_HO_AVBL] === 'on' ? 1 : 0,
                es: E84BitState[e84BitStateNum.E84_BIT_ES] === 'on' ? 1 : 0,
                valid: E84BitState[e84BitStateNum.E84_BIT_VALID] === 'on' ? 1 : 0,
                cs_0: E84BitState[e84BitStateNum.E84_BIT_CS_0] === 'on' ? 1 : 0,
                TR_REQ: E84BitState[e84BitStateNum.E84_BIT_TR_REQ] === 'on' ? 1 : 0,
                busy: E84BitState[e84BitStateNum.E84_BIT_BUSY] === 'on' ? 1 : 0,
                compt: E84BitState[e84BitStateNum.E84_BIT_COMPT] === 'on' ? 1 : 0,
                timestamp: row.Date
            }]));
        } catch (ex) {
            logger.error(ex as Error);
        }
    }
}
