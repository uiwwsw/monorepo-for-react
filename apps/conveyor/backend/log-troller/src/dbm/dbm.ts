import { Service } from "../service";
import { Redis } from "ioredis";
import logger from "../libs/logger";
import {
    TaskTransferInfoRow,
    CompleteCarrierRow,
    DestinationZoneRow,
} from "../models/R301";
import {
    ITaskTransferInfoRow,
    ICompleteCarrierRow,
    IDestinationZoneRow,
} from "../types/R301";
import { TITAN_INTERNAL_EVENT_ID } from "../models/tcmEventId";
import { ITaskTransferInfo } from "../models/taskTransferInfo";
import { ITcsEventSet } from "../models/tcsEventSet";
import { IWarningInfo } from "../models/warningInfo";
import { IZoneDynamicattributes } from "../models/zoneDynamicattributes";
import { IZoneOccupiedAttributes } from "../models/zoneOccupiedAttributes";
import { e84BitStateNum } from "../models/e84BitStates";

class TransItem {
    public Query!: string;
    public Params!: unknown[];
    public constructor(query: string, params: unknown[] = []) {
        this.Query = query;
        this.Params = params;
    }
}

interface IMsgQueueRow {
    Date: Date;
    Channel: string;
    Message: string;
    Result: string;
}

export class DBM {
    private subs!: Redis;
    private queue:unknown[] = [];
    private transList: TransItem[] = [];
    private taskTransferInfos: { [key: number]: ITaskTransferInfoRow } = {};
    private completeCarriers: { [key: number]: ICompleteCarrierRow } = {};
    private destinationZones: { [key: number]: IDestinationZoneRow } = {};
    private e84jobs: { [key: string]: Date } = {};
    private tasktransferinfostatus: unknown[] = [];
    private zonedynamicattributes: unknown[] = [];
    private zoneoccupiedattributes: unknown[] = [];
    private logs: unknown[] = [];
    private e84JobStates: unknown[] = [];
    private isRunning: boolean = false;

    public constructor(redis: Redis) {
        this.subs = redis;

        process.nextTick(async () => {
            await this.checkSkip();
            await this.getTransferInfos();
            await this.getCompleteCarriers();
            await this.getDestinationZones();

            this.subs.subscribe("AlarmEventCh");
            this.subs.subscribe("TransferInfoCh");
            this.subs.subscribe("UIMCh");
            this.subs.subscribe("Logs");
            this.subs.psubscribe("TCMZoneCh:*");

            this.subs.on("message", (channel, message) => {
                this.onRecvMessage(channel, message);
            });

            this.subs.on("pmessage", (pattern, channel, message) => {
                this.onRecvMessage(channel, message);
            });

            setInterval(() => { this.run(); }, 100);
        });
    }

    // Redis에 등록되어 있는데, MySQL에 등록되지 않은 TaskTransferInfo 정보를 등록
    private async checkSkip() {
        try {
            const keys = await Service.Inst.Redis.keys("TransferInfo:*[0-9]");
            const params = [];
            for (let i = 0, iLen = keys.length; i < iLen; i++) {
                const key = keys[i];
                const task = await Service.Inst.Redis.hmget(
                    key,
                    "Location",
                    "From",
                    "CarrierID",
                    "State",
                    "CommandID",
                    "To",
                    "Junctions"
                );
                if (task[0] == null) {
                    continue;
                }
                params.push([
                    {
                        taskID: key.substring(13),
                        zoneIDFrom: task[1],
                        carrierID: task[2],
                        commandID: task[4],
                        ZoneIDTo: task[5],
                        StartTime: new Date(),
                    },
                    task[1],
                    task[2],
                    task[4],
                    task[5],
                ]);
            }
            const conn = await Service.Inst.LocalDB.getConnection();
            try {
                await conn.beginTransaction();
                for (let i = 0, iLen = params.length; i < iLen; i++) {
                    const param = params[i];
                    await conn.query(
                        "insert into tasktransferinfo set ? ON DUPLICATE KEY UPDATE zoneIdFrom = ?, carrierId = ?, commandId = ?, zoneIdTo = ?",
                        param
                    );
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
            const [rows] = await Service.Inst.LocalDB.query<
                TaskTransferInfoRow[]
            >("SELECT * FROM tasktransferinfo where EndTime is null");
            for (let i = 0, iLen = rows.length; i < iLen; i++) {
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
            const [rows] = await Service.Inst.LocalDB.query<
                CompleteCarrierRow[]
            >("SELECT * FROM completecarrier");
            for (let i = 0, iLen = rows.length; i < iLen; i++) {
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
            const [rows] = await Service.Inst.LocalDB.query<
                DestinationZoneRow[]
            >("SELECT * FROM destinationzone");
            for (let i = 0, iLen = rows.length; i < iLen; i++) {
                const row = rows[i];
                this.destinationZones[row.ZoneID] = row;
            }
        } catch (ex) {
            logger.error(ex as Error);
        }
    }

    // Redis 메시지 수신 이벤트 처리
    private onRecvMessage(channel: string, message: string) {
        const body = { Date: new Date(), Channel: channel, Message: message };
        this.queue.push(JSON.stringify(body));
    }

    // 메시지 처리 루프
    private async run() {
        try {
            if (this.isRunning) {
                return;
            }
            this.isRunning = true;
            const queueLen = await this.queue.length;
            if (queueLen < 1) {
                return;
            }
            const begin = new Date();
            const count = queueLen > 1000 ? 1000 : queueLen;
            this.transList = [];
            this.tasktransferinfostatus = [];
            this.zonedynamicattributes = [];
            this.zoneoccupiedattributes = [];
            this.e84JobStates = [];
            this.logs = [];
            const ins_stats: { [key: string]: number } = {};
            const queue = this.queue.splice(0, count);
            for (let i = 0; i < count; i++) {
                const json = queue[i] as string;
                if (!json) {
                    continue;
                }
                try {
                    const row = JSON.parse(json) as IMsgQueueRow;
                    row.Date = new Date(row.Date);
                    this.processMessage(row);
                } catch (ex) {
                    const err = ex as Error;
                    logger.error(
                        `run.processMessage. ${err.message}\n${err.stack}`
                    );
                }
            }
            if (this.transList.length > 0) {
                const conn = await Service.Inst.LocalDB.getConnection();
                try {
                    await conn.beginTransaction();
                    for (
                        let i = 0, iLen = this.transList.length;
                        i < iLen;
                        i++
                    ) {
                        const trans = this.transList[i];
                        await conn.query(trans.Query, trans.Params);
                        if (trans.Query.indexOf("insert into") === 0) {
                            const ary = trans.Query.split(" ");
                            const table = ary[2];
                            ins_stats[table] = ins_stats[table]
                                ? ins_stats[table] + 1
                                : 1;
                        }
                    }
                    await conn.commit();
                } catch (ex) {
                    logger.error(ex as Error);
                    await conn.rollback();
                } finally {
                    await conn.release();
                }
            }
            if (this.tasktransferinfostatus.length > 0) {
                try {
                    await Service.Inst.LocalDB.query(
                        "insert into tasktransferinfostatus (taskID, state, zoneIdCurrent, timeStamp) values ? ",
                        [this.tasktransferinfostatus]
                    );
                } catch (ex) {
                    logger.error(ex as Error);
                }
            }
            if (this.zonedynamicattributes.length > 0) {
                try {
                    await Service.Inst.LocalDB.query(
                        "insert into zonedynamicattributes (zoneId, state, prevState, motorState, timeStamp) values ? ",
                        [this.zonedynamicattributes]
                    );
                } catch (ex) {
                    logger.error(ex as Error);
                }
            }
            if (this.zoneoccupiedattributes.length > 0) {
                try {
                    await Service.Inst.LocalDB.query(
                        "insert into zoneoccupiedattributes (zoneId, reservedTaskId, occupiedSensor1, occupiedSensor2, occupiedSensor3, currentDirection, currentLevel, alarmSerialNumber, timeStamp) values ? ",
                        [this.zoneoccupiedattributes]
                    );
                } catch (ex) {
                    logger.error(ex as Error);
                }
            }
            if (this.e84JobStates.length > 0) {
                try {
                    await Service.Inst.LocalDB.query(
                        "insert into E84JobStates (e84JobId, sequenceState, L_REQ, U_REQ, READY, HO_AVBL, es, valid, cs_0, TR_REQ, busy, compt, timestamp) values ? ",
                        [this.e84JobStates]
                    );
                } catch (ex) {
                    logger.error(ex as Error);
                }
            }
            if (this.logs.length > 0) {
                try {
                    await Service.Inst.LocalDB.query(
                        "insert into logs (TimeStamp, Level, TCMID, TaskID, ZoneID, Comment) values ? ",
                        [this.logs]
                    );
                } catch (ex) {
                    logger.error(ex as Error);
                }
            }
            const end = new Date();
            const elapsed = end.getTime() - begin.getTime();
            const queryNum =
                this.transList.length +
                this.tasktransferinfostatus.length +
                this.zonedynamicattributes.length +
                this.zoneoccupiedattributes.length +
                this.e84JobStates.length +
                this.logs.length;
            logger.info(
                `run. message:${count}, query:${queryNum}, total:${queueLen} messages processed. ${elapsed}ms elapsed.`
            );
            if (Object.keys(ins_stats).length > 0) {
                console.log(JSON.stringify(ins_stats, null, 2));
            }
            // E84JobID가 있는 경우, 10분 이상 지난 경우 삭제
            const now = new Date();
            for (const key in this.e84jobs) {
                if (this.e84jobs[key].getTime() + 600000 < now.getTime()) {
                    delete this.e84jobs[key];
                }
            }
        } catch (ex) {
            logger.error(ex);
        } finally {
            this.isRunning = false;
        }
    }

    // 트랜잭션 처리 실패 시 처리 절차,,
    private async eachTransQuery() {
        for (let i = 0, iLen = this.transList.length; i < iLen; i++) {
            const trans = this.transList[i];
            try {
                await Service.Inst.LocalDB.query(trans.Query, trans.Params);
            } catch (ex) {
                const err = ex as Error;
                logger.error(
                    `eachTransQuery. query:${trans.Query}, ex:${err.message}\n${err.stack}`
                );
            }
        }
    }

    private pad(number: number, length: number) {
        let str = "" + number;
        while (str.length < length) {
            str = "0" + str;
        }
        return str;
    }

    private dateToSerialNo(date: Date) {
        const yyyy = date.getFullYear().toString();
        const MM = this.pad(date.getMonth() + 1, 2);
        const dd = this.pad(date.getDate(), 2);
        const hh = this.pad(date.getHours(), 2);
        const mm = this.pad(date.getMinutes(), 2);
        const ss = this.pad(date.getSeconds(), 2);

        return yyyy + MM + dd + hh + mm + ss;
    }

    // 각각의 메시지 처리,,
    private async processMessage(row: IMsgQueueRow) {
        const obj = JSON.parse(row.Message);
        const msg = obj.MessageData;
        switch (obj.MessageID) {
            case "tcmAlarmSet":
                this.transList.push(
                    new TransItem("insert into alarminfo set ?", [
                        {
                            serialNo: msg.SerialNumber,
                            alarmCode: msg.AlarmCode,
                            taskId: msg.TaskID,
                            location: msg.Location,
                            reason: msg.Reason,
                            commandId: msg.CommandID,
                            tcmid: msg.Location
                                ? Math.floor(msg.Location / 100)
                                : -1,
                            carrierId: msg.CarrierID,
                            setTime: row.Date,
                        },
                    ])
                );
                break;
            case "tcmAlarmCleared":
                this.transList.push(
                    new TransItem(
                        "update alarminfo set clearTime = ? where serialNo = ? and clearTime is null",
                        [row.Date, msg.SerialNumber]
                    )
                );
                break;
            case "tcmTransferInfo":
                {
                    const tcminfo: ITaskTransferInfo = msg.Object;
                    if (tcminfo.State === "READY") {
                        this.transList.push(
                            new TransItem(
                                "insert into tasktransferinfo set ?",
                                [
                                    {
                                        taskID: tcminfo.TaskID,
                                        zoneIDFrom: tcminfo.ZoneIDFrom
                                            ? tcminfo.ZoneIDFrom
                                            : null,
                                        startTime: row.Date,
                                    },
                                ]
                            )
                        );
                        this.taskTransferInfos[tcminfo.TaskID] = {
                            TaskID: tcminfo.TaskID,
                            ZoneIDFrom: tcminfo.ZoneIDFrom
                                ? tcminfo.ZoneIDFrom
                                : 0,
                            StartTime: row.Date,
                        };
                    } else if (tcminfo.ZoneIDTo) {
                        // DESTINATION UPDATE
                        this.transList.push(
                            new TransItem(
                                "update tasktransferinfo set zoneIDTo = ? where taskID = ?",
                                [tcminfo.ZoneIDTo, tcminfo.TaskID]
                            )
                        );
                        this.taskTransferInfos[tcminfo.TaskID] && (this.taskTransferInfos[tcminfo.TaskID].ZoneIDTo = tcminfo.ZoneIDTo);
                    }
                    this.tasktransferinfostatus.push([
                        tcminfo.TaskID,
                        tcminfo.State || "",
                        tcminfo.ZoneIDCurrent || -1,
                        row.Date,
                    ]);
                }
                break;
            case "tcsEventSet":
                {
                    const tcmEvent: ITcsEventSet = msg;
                    if (tcmEvent.CommandID && tcmEvent.CommandID.length > 0) {
                        this.transList.push(
                            new TransItem(
                                "update tasktransferinfo set commandId = ? where taskID = ?",
                                [tcmEvent.CommandID, tcmEvent.TaskID]
                            )
                        );
                        this.taskTransferInfos[tcmEvent.TaskID] &&
                            (this.taskTransferInfos[tcmEvent.TaskID].CommandID =
                                tcmEvent.CommandID);
                    }
                    this.handleEventLogs(tcmEvent, row);
                }
                break;
            case "tcsLogsMessage":
                this.transList.push(
                    new TransItem("insert into logs set ?", [
                        {
                            TimeStamp: row.Date,
                            Level: msg.Level,
                            TCMID: msg.TCMID,
                            TaskID: msg.TaskID,
                            ZoneID: msg.ZoneID,
                            Comment: msg.Comment,
                        },
                    ])
                );
                break;
            case "tcsWarningSet":
                {
                    const tcmWarning: IWarningInfo = msg;
                    this.transList.push(
                        new TransItem("insert into warninginfo set ?", [
                            {
                                serialNo: tcmWarning.SerialNo,
                                warningCode: tcmWarning.EventCode
                                    ? +tcmWarning.EventCode
                                    : -1,
                                taskId: +tcmWarning.TaskID,
                                location: tcmWarning.Location
                                    ? +tcmWarning.Location
                                    : -1,
                                reason: tcmWarning.Reason
                                    ? +tcmWarning.Reason
                                    : -1,
                                commandId: tcmWarning.CommandID,
                                carrierId: tcmWarning.CarrierID,
                                setTime: row.Date,
                            },
                        ])
                    );
                }
                break;
            case "tcmZoneStateAttributes":
                {
                    const zone: IZoneDynamicattributes = msg.Object;
                    this.zonedynamicattributes.push([
                        zone.ZoneID,
                        zone.State,
                        zone.PrevState,
                        zone.MotorState,
                        row.Date,
                    ]);
                    this.saveE84States(zone, row);
                }
                break;
            case "tcmZoneOccupiedAttributes":
                {
                    const occupiedInfo: IZoneOccupiedAttributes = msg.Object;
                    this.zoneoccupiedattributes.push([
                        occupiedInfo.ZoneID,
                        occupiedInfo.ReservedTaskID === -1
                            ? 0
                            : occupiedInfo.ReservedTaskID,
                        occupiedInfo.OccupiedSensor1
                            ? +occupiedInfo.OccupiedSensor1
                            : -1,
                        occupiedInfo.OccupiedSensor2
                            ? +occupiedInfo.OccupiedSensor2
                            : -1,
                        occupiedInfo.OccupiedSensor3
                            ? +occupiedInfo.OccupiedSensor3
                            : -1,
                        occupiedInfo.CurrentDirection
                            ? +occupiedInfo.CurrentDirection
                            : -1,
                        occupiedInfo.CurrentLevel
                            ? +occupiedInfo.CurrentLevel
                            : -1,
                        +occupiedInfo.AlarmSerialNumber,
                        row.Date,
                    ]);
                    /*
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
                    */
                }
                break;
            case 'himEquipmentStateInfo':
                break;
            case 'himAlarmInfo':
                logger.info(`processMessage. ${row.Message}`);
                break;
            default:
                logger.error(
                    `processMessage. Unknown message ID: ${obj.MessageID}`
                );
                break;
        }
    }

    private handleEventLogs(tcmEvent: ITcsEventSet, row: IMsgQueueRow) {
        let comment = "";
        switch (tcmEvent.EventCode) {
            case TITAN_INTERNAL_EVENT_ID.EVENT_READ_RFID:
                this.transList.push(
                    new TransItem(
                        "update tasktransferinfo set carrierId = ? where taskId = ?",
                        [tcmEvent.CarrierID, tcmEvent.TaskID]
                    )
                );
                comment = `read RFID zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_CARRIER_INSTALLED:
                /**CARRIER ID 화인 될 경우 CARRIER ID UPDATE */
                this.transList.push(
                    new TransItem(
                        "update tasktransferinfo set carrierId = ?, zoneIdFrom = ? where taskId = ?",
                        [tcmEvent.CarrierID, tcmEvent.Location, tcmEvent.TaskID]
                    )
                );
                comment = `carrier installed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_ABORTED:
                comment = `transfer aborted zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_COMPLETED:
                /** 이송 완료 될 경우 DB에 저장 */
                this.transList.push(
                    new TransItem(
                        "update tasktransferinfo set zoneIdTo=?, endTime = ? where taskId = ?",
                        [tcmEvent.Location, row.Date, tcmEvent.TaskID]
                    )
                );

                // CompleteCarrier, DestinationZone에 저장
                if (this.completeCarriers[tcmEvent.Location]) {
                    this.transList.push(
                        new TransItem(
                            "update completecarrier set useCount = useCount + 1, timeStamp = ? where zoneId = ?",
                            [row.Date, tcmEvent.Location]
                        )
                    );
                } else {
                    this.transList.push(
                        new TransItem("insert into completecarrier set ?", [
                            {
                                zoneId: tcmEvent.Location,
                                useCount: 1,
                                timeStamp: row.Date,
                            },
                        ])
                    );
                    this.completeCarriers[tcmEvent.Location] = {
                        ZoneID: tcmEvent.Location,
                        UseCount: 1,
                        TimeStamp: row.Date,
                    };
                }
                if (this.destinationZones[tcmEvent.Location]) {
                    this.transList.push(
                        new TransItem(
                            "update destinationzone set useCount = useCount + 1, timeStamp = ? where zoneId = ?",
                            [row.Date, tcmEvent.Location]
                        )
                    );
                } else {
                    this.transList.push(
                        new TransItem("insert into destinationzone set ?", [
                            {
                                zoneId: tcmEvent.Location,
                                useCount: 1,
                                timeStamp: row.Date,
                            },
                        ])
                    );
                    this.destinationZones[tcmEvent.Location] = {
                        ZoneID: tcmEvent.Location,
                        UseCount: 1,
                        TimeStamp: row.Date,
                    };
                }

                // CompleteCarrierCount에 저장
                this.transList.push(
                    new TransItem("insert into completecarriercount set ?", [
                        {
                            carrierId: this.taskTransferInfos[tcmEvent.TaskID]
                                ? this.taskTransferInfos[tcmEvent.TaskID]
                                      .CarrierID
                                : "UNKNOWN",
                            zoneId: tcmEvent.Location,
                            timeStamp: row.Date,
                        },
                    ])
                );
                delete this.taskTransferInfos[tcmEvent.TaskID];
                comment = `transfer completed zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TRANSFER_INITIATED:
                comment = `transfer initiated zone[${tcmEvent.Location}]`;
                break;
            case TITAN_INTERNAL_EVENT_ID.EVENT_TSC_AUTO_COMPLETED:
                break;

            case TITAN_INTERNAL_EVENT_ID.EVENT_TSC_PAUSED:
                break;

            case TITAN_INTERNAL_EVENT_ID.EVENT_TSC_CONTROL_ONLINE:
                break;

            case TITAN_INTERNAL_EVENT_ID.EVENT_TSC_CONTROL_OFFLINE:
                break;

            case TITAN_INTERNAL_EVENT_ID.EVENT_TSC_ERR_NONE:
                break;

            case TITAN_INTERNAL_EVENT_ID.EVENT_TSC_ERR_ALARM:
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

        comment.length > 0 &&
            this.logs.push([
                row.Date,
                0,
                tcmEvent.Location
                    ? `${Math.floor(+tcmEvent.Location / 100)}`
                    : `-1`,
                tcmEvent.TaskID ? +tcmEvent.TaskID : -1,
                tcmEvent.Location,
                comment,
            ]);
        /*
        this.transList.push(new TransItem('insert into logs set ?', [{
            TimeStamp: row.Date,
            Level: 0,
            EventCode : tcmEvent.EventCode,
            TCMID: tcmEvent.Location ? `${Math.floor(+tcmEvent.Location / 100)}` : `-1`,
            TaskID: tcmEvent.TaskID ? +tcmEvent.TaskID : -1,
            ZoneID: tcmEvent.Location,
            Comment: comment
        }]));
        */
    }

    private saveE84States(
        dynamicAttributes: IZoneDynamicattributes,
        row: IMsgQueueRow
    ) {
        try {
            if (
                !dynamicAttributes.E84JobID ||
                dynamicAttributes.E84JobID === -1 ||
                dynamicAttributes.E84BitState === undefined
            ) {
                logger.warn(
                    `saveE84States. Invalid E84JobID: ${dynamicAttributes.E84JobID}`
                );
                return;
            }
            const E84JobID = `${dynamicAttributes.E84JobID}`;
            if (!this.e84jobs[E84JobID]) {
                this.e84jobs[E84JobID] = row.Date;
                this.transList.push(
                    new TransItem(
                        "insert into E84Jobs set ? ON DUPLICATE KEY UPDATE startTime = startTime",
                        [
                            {
                                e84JobId: E84JobID,
                                zoneId: dynamicAttributes.ZoneID,
                                startTime: row.Date,
                            },
                        ]
                    )
                );
            }
            const E84BitState = dynamicAttributes.E84BitState.split(",");
            this.e84JobStates.push([
                E84JobID,
                dynamicAttributes.E84Sequence,
                E84BitState[e84BitStateNum.E84_BIT_L_REQ] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_U_REQ] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_READY] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_HO_AVBL] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_ES] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_VALID] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_CS_0] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_TR_REQ] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_BUSY] === "on" ? 1 : 0,
                E84BitState[e84BitStateNum.E84_BIT_COMPT] === "on" ? 1 : 0,
                row.Date,
            ]);
            /*
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
            */
        } catch (ex) {
            logger.error(ex as Error);
        }
    }
}
