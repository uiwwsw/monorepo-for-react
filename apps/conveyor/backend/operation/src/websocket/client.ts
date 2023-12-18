import WebSocket from 'ws';

import { 
    WebSocketMessage,
    UserSession,
    AlarmClearReq,
    ChangeDestReq,
    ControlModuleReq,
    StateChangeReq,
    SignalTowerReq
} from '@package-backend/types';
import { initailizeRedisInfo } from './redis_utils';
import { ActionTypes } from './action_type';
import { ZoneType } from '../zone/zoneType';
import { MotionCommands, ZoneCmdReq } from './motion_commands';
import { TaskCommnds, TaskCmdReq } from './task_commands';
import * as uim from './uimControlModule';
import { Service } from '../service';
import * as MsgUtils from './message';
import * as utils from '../libs/utils';
import * as ChangeMotionParameter from './changeMotionParameter';
import logger from '../libs/logger';

export class Client {
    private socket: WebSocket;
    private session: UserSession;
    private isReady : boolean = false;

    public constructor(socket: WebSocket, session : UserSession) {
        this.socket = socket;
        this.session = session;

        this.socket.on('message', this.onRecvMessage);
    }

    public get Session() : UserSession {
        return this.session;
    }

    public close() {
        this.socket.close();
    }

    public async send(type:string, data:object) {
        const json = JSON.stringify(data);
        // Dashboard나 Tablet에서는 2048byte 이상의 데이터는 압축하여 전송,,
        if (json.length > 2048 && this.session.client_type !== 1) {
            const compressed = await utils.jsonToZipAndEncodeBase64(json);
            const msg:WebSocketMessage = {
                type: type,
                data: compressed,
                compress: 1
            };
            this.socket.send(JSON.stringify(msg));
        } else {
            const msg:WebSocketMessage = {
                type: type,
                data: json,
                compress: 0
            };
            this.socket.send(JSON.stringify(msg));
        }
        logger.debug(`send. uid:${this.session.uid}, type:${type}, data:${json}`);
    }

    public get ClientType() : number {
        return this.session.client_type;
    }

    public get IsReady() : boolean {
        return this.isReady;
    }

    private onRecvMessage = async (body:string) => {
        const begin = new Date().getTime();
        try {
            const msg:WebSocketMessage = JSON.parse(body);
            let result = 'OK';
            try {
                if (msg.compress === 1) {
                    msg.data = await utils.uncompressBase64ToJson(msg.data);
                }
                switch(msg.type) {
                    case ActionTypes.ZONE_GET_INFO:
                        await initailizeRedisInfo(this);
                        this.isReady = true;
                        break;
                    case ActionTypes.INITIAL_REDIS_SUBSCRIBER:
                        break;
                    case ActionTypes.ZONE_COMMAND_HOME:
                    case ActionTypes.ZONE_COMMAND_MOVE:
                    case ActionTypes.ZONE_COMMAND_MOVE_REL: 
                    case ActionTypes.ZONE_COMMAND_RESET:
                    case ActionTypes.ZONE_COMMAND_STOP:
                    case ActionTypes.ZONE_COMMAND_SERVO_OFF:
                    case ActionTypes.ZONE_COMMAND_SERVO_ON:
                    case ActionTypes.ZONE_COMMAND_ONLINE:
                    case ActionTypes.ZONE_COMMAND_OFFLINE:
                    case ActionTypes.ZONE_COMMAND_AUTO:
                    case ActionTypes.ZONE_COMMAND_MANUAL:
                    case ActionTypes.ZONE_COMMAND_SET_LIMIT:
                    case ActionTypes.ZONE_COMMAND_CLEAR_LIMIT:
                    case ActionTypes.ZONE_CLEAR_MOTOR_ERROR_ALL:
                    case ActionTypes.ZONE_COMMAND_RESET_ALL:
                    case ActionTypes.ZONE_COMMAND_HOME_ALL:
                    case ActionTypes.ZONE_COMMAND_SERVO_ON_ALL:
                    case ActionTypes.ZONE_COMMAND_SERVO_OFF_ALL:
                    case ActionTypes.ZONE_COMMAND_STOP_ALL:
                    case ActionTypes.ZONE_COMMAND_FORCE_RESERVE:
                    case ActionTypes.HIM_FORCE_INSTALL_CARRIER:
                    case ActionTypes.ZONE_COMMAND_CHANGE_LOCATION:
                    case ActionTypes.ZONE_COMMAND_REINSTALL:
                    case ActionTypes.CHANGE_OFFSET_MOVE_RELATIVE_QS:
                    case ActionTypes.CHANGE_OFFSET_SELECTED_QS:
                    case ActionTypes.ZONE_COMMAND_DEFAULT_DESTNATION:
                    case ActionTypes.READ_RFID:
                    case ActionTypes.COMMAND_SET_SAFE_LOCK:
                    case ActionTypes.ZONE_COMMAND_ALL_MOVE_VEL:
                        {
                            const req = JSON.parse(msg.data) as ZoneCmdReq;
                            this.onZoneMessage(msg.type, req);
                        }
                        break;
                    case ActionTypes.TASK_COMMAND_PAUSE:
                    case ActionTypes.TASK_COMMAND_RESUME:
                    case ActionTypes.TASK_COMMAND_ABORT:
                    case ActionTypes.TASK_COMMAND_RECOVERY:
                    case ActionTypes.ZONE_COMMAND_RECOVERY_ALL:
                    case ActionTypes.ZONE_COMMAND_RESUME_ALL:
                    case ActionTypes.ZONE_COMMAND_PAUSE_ALL:
                        {
                            const req = JSON.parse(msg.data) as TaskCmdReq;
                            this.onTaskMessage(msg.type, req);
                        }
                        break;
                    case ActionTypes.TCM_ALARM_CLEAR:
                        {
                            const req = JSON.parse(msg.data) as AlarmClearReq;
                            this.onPostClearAlarm(req.SerialNo);
                        }
                        break;
                    case ActionTypes.ZONE_COMMAND_CHANGE_DESTINATION:
                    case ActionTypes.ZONE_COMMAND_REVERSE_CHANGE_DESTINATION:
                        {
                            const req = JSON.parse(msg.data) as ChangeDestReq;
                            this.onPostDestChangeCommand(req.TaskID, req.DestniZone, req.ZoneIDJunctions);
                        }
                        break;
                    case ActionTypes.ZONE_COMMAND_REORDER:
                        {
                            const req = JSON.parse(msg.data) as ChangeDestReq;
                            this.onPostReorderCommand(req.TaskID);
                        }
                        break;
                    case ActionTypes.MODULE_STOP_DCM:
                        this.onControlModule(uim.COMMAND.COMMAND_STOP, uim.MODULE.MODULE_DCM, 0);
                        break;
                    case ActionTypes.MODULE_START_DCM:
                        this.onControlModule(uim.COMMAND.COMMAND_START, uim.MODULE.MODULE_DCM, 0);
                        break;
                    case ActionTypes.MODULE_STOP_HIM:
                        this.onControlModule(uim.COMMAND.COMMAND_STOP, uim.MODULE.MODULE_HIM, 0);
                        break;
                    case ActionTypes.MODULE_START_HIM:
                        this.onControlModule(uim.COMMAND.COMMAND_START, uim.MODULE.MODULE_HIM, 0);
                        break;
                    case ActionTypes.MODULE_STOP_TCM:
                        {
                            const req = JSON.parse(msg.data) as ControlModuleReq;
                            this.onControlModule(uim.COMMAND.COMMAND_STOP, uim.MODULE.MODULE_TCM, req.TCM_ID);
                        }
                        break;
                    case ActionTypes.MODULE_START_TCM:
                        {
                            const req = JSON.parse(msg.data) as ControlModuleReq;
                            this.onControlModule(uim.COMMAND.COMMAND_START, uim.MODULE.MODULE_TCM, req.TCM_ID);
                        }
                        break;
                    case ActionTypes.MODULE_RESTART_HIM:
                        this.onControlModule(uim.COMMAND.COMMAND_RESTART, uim.MODULE.MODULE_HIM, 0);
                        break;
                    case ActionTypes.MODULE_RESTART_DCM:
                        this.onControlModule(uim.COMMAND.COMMAND_RESTART, uim.MODULE.MODULE_DCM, 0);
                        break;
                    case ActionTypes.MODULE_RESTART_TCM:
                        {
                            const req = JSON.parse(msg.data) as ControlModuleReq;
                            this.onControlModule(uim.COMMAND.COMMAND_RESTART, uim.MODULE.MODULE_TCM, req.TCM_ID);
                        }
                        break;
                    case ActionTypes.EQUIPMENT_STATE_CHANGE_COMM_DISABLE:
                    case ActionTypes.EQUIPMENT_STATE_CHANGE_COMM_ENABLE:
                    case ActionTypes.EQUIPMENT_STATE_CHANGE_CONTROL_OFFLINE:
                    case ActionTypes.EQUIPMENT_STATE_CHANGE_CONTROL_ONLINE_LOCAL:
                    case ActionTypes.EQUIPMENT_STATE_CHANGE_CONTROL_ONLINE_REMOTE:
                        {
                            const req = JSON.parse(msg.data) as StateChangeReq;
                            this.onEquipComStateChange(msg.type, req);
                        }
                        break;
                    case ActionTypes.CHANGE_EACH_MOTION_PARAM_SELECTED_ZONE:
                        ChangeMotionParameter.onChangeEachParameter(JSON.parse(msg.data), this);
                        break;
                    case ActionTypes.CHANGE_EVERY_MOTION_PARAM_SELECTED_ZONE:
                        ChangeMotionParameter.onChangeEveryParameterSelectedZone(JSON.parse(msg.data), this);
                        break;
                    case ActionTypes.CHANGE_EVERY_MOTION_PARAM_SAMETYPE_ZONES:
                        ChangeMotionParameter.onChangeEveryParameterSameTypeZone(JSON.parse(msg.data), this);
                        break;
                    case ActionTypes.CHANGE_EVERY_MOTION_PARAM_ALL_ZONES:
                        ChangeMotionParameter.onChangeEveryParameterAllZone(JSON.parse(msg.data), this);
                        break;
                    case ActionTypes.MODULE_RELOAD_TCM:
                        {
                            const req = JSON.parse(msg.data) as ControlModuleReq;
                            const body = MsgUtils.makeUimConfigurationSet(2, req.TCM_ID);
                            Service.Inst.Redis.publish(`TCMCmdCh:${req.TCM_ID}`, body);
                        }
                        break;
                    case ActionTypes.MODULE_RELOAD_DCM:
                        Service.Inst.Redis.publish('SysCmdCh', MsgUtils.makeUimConfigurationSet(0, -1));
                        break;        
                    case ActionTypes.MODULE_RELOAD_HIM:
                        break;                                   
                    case ActionTypes.TURN_OFF_SIGNAL_TOWER: {
                        const req = JSON.parse(msg.data) as SignalTowerReq;
                        Service.Inst.Redis.publish(`TCMCmdCh:${req.TCM_ID}`, MsgUtils.makeHimControlSignal(req.Buzzer));
                        break;
                    }                             
                    default:
                        logger.warn(`Unknown message type: ${msg.type}, body: ${msg.data}`);
                        break;
                }
            } catch (err) {
                logger.error(`Failed to process uid:${this.session.uid} message: ${msg.type}, body: ${msg.data}`);
                result = (err as Error).message;
            }
    
            if (msg.tid) {
                this.send('MessageResult', { result: result, type : msg.type, tid: msg.tid });
            }
            const end = new Date().getTime();
            logger.debug(`onRecvMessage. uid:${this.session.uid}, type:${msg.type}, data:${msg.data}, result:${result}, elapsed:${end - begin}ms`);
        } catch (ex) {
            logger.error(`onRecvMessage. uid:${this.session.uid}, body:${body} ex: ${ex}`);
        }
    }

    onZoneMessage(type: ActionTypes, req:ZoneCmdReq) {
        const zoneRepo = Service.Inst.ZoneRepo;
        const zone = zoneRepo.Data.get(req.ZoneID);
        if (!zone) {
            throw new Error(`Zone not found. zone_id:${req.ZoneID}`);
        }
        switch(type) {
            case ActionTypes.ZONE_COMMAND_HOME:
                this.onZoneCommand(MotionCommands.COMMAND_HOMMING, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_MOVE:
                {
                    let direction = 0;
                    if (zone.PhysicalType !== ZoneType.TYPE_LIFTER && zone.PhysicalType !== ZoneType.TYPE_LIFTER_SINGLE) {
                        if (req.MoveType === 0) {
                            direction = 0;
                            this.onZoneCommand(MotionCommands.COMMAND_MOVE_VEL, req.ZoneID, direction, 0);
                        } else if (req.MoveType === 1) {
                            direction = 1;
                            this.onZoneCommand(MotionCommands.COMMAND_MOVE_VEL, req.ZoneID, direction, 0);
                        } else if (req.MoveType === 2) {
                            direction = 0;
                            this.onZoneCommand(MotionCommands.COMMAND_MOVE_TURN, req.ZoneID, direction, 0);
                        } else if (req.MoveType === 3) {
                            direction = 1;
                            this.onZoneCommand(MotionCommands.COMMAND_MOVE_TURN, req.ZoneID, direction, 0);
                        } else if (req.MoveType === 4) {
                            direction = 2;
                            this.onZoneCommand(MotionCommands.COMMAND_MOVE_TURN, req.ZoneID, direction, 0);
                        }
                    } else {
                        this.onZoneCommand(MotionCommands.COMMAND_MOVE_LIFT, req.ZoneID, req.MoveType, 0);
                    }
                }
                break;
            case ActionTypes.ZONE_COMMAND_MOVE_REL: 
                if (zone.PhysicalType === +ZoneType.TYPE_LIFTER) {
                    this.onZoneCommand(MotionCommands.COMMAND_MOVE_REL, req.ZoneID, 0, req.Position);
                }
                break;
            case ActionTypes.ZONE_COMMAND_RESET:
                this.onZoneCommand(MotionCommands.COMMAND_RESET, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_STOP:
                this.onZoneCommand(MotionCommands.COMMAND_MOVE_STOP, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_SERVO_OFF:
                this.onZoneCommand(MotionCommands.COMMAND_SERVO_OFF, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_SERVO_ON:
                this.onZoneCommand(MotionCommands.COMMAND_SERVO_ON, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_ONLINE:                
                Service.Inst.Redis.publish(`TCMCmdCh:${Math.floor(req.ZoneID / 100)}`, MsgUtils.makeUimZoneStateChangeReq(req.ZoneID, 'InService'));
                break;
            case ActionTypes.ZONE_COMMAND_OFFLINE:
                Service.Inst.Redis.publish(`TCMCmdCh:${Math.floor(req.ZoneID / 100)}`, MsgUtils.makeUimZoneStateChangeReq(req.ZoneID, 'Offline'));
                break;
            case ActionTypes.ZONE_COMMAND_AUTO:
                Service.Inst.Redis.publish(`TCMCmdCh:${Math.floor(req.ZoneID / 100)}`, MsgUtils.makeMessageUimZoneUserAttributes(1, -1, req.ZoneID));
                break;
            case ActionTypes.ZONE_COMMAND_MANUAL:
                Service.Inst.Redis.publish(`TCMCmdCh:${Math.floor(req.ZoneID / 100)}`, MsgUtils.makeMessageUimZoneUserAttributes(0, -1, req.ZoneID));
                break;
            case ActionTypes.ZONE_COMMAND_SET_LIMIT:
                this.onZoneCommand(MotionCommands.COMMAND_SENSOR1_NGELIMIT, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_CLEAR_LIMIT:
                this.onZoneCommand(MotionCommands.COMMAND_SENSOR1_LIMIT_CLEAR, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_CLEAR_MOTOR_ERROR_ALL:
                this.onZoneCommand(MotionCommands.COMMAND_CLEAR_ALL_MOTOR_ERROR, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_RESET_ALL:
                this.onZoneCommand(MotionCommands.DEP_COMMAND_ALL_RESET, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_HOME_ALL:
                this.onZoneCommand(MotionCommands.COMMAND_ALL_HOMMING, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_SERVO_ON_ALL:
                this.onZoneCommand(MotionCommands.COMMAND_ALL_SERVO_ON, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_SERVO_OFF_ALL:
                this.onZoneCommand(MotionCommands.COMMAND_ALL_SERVO_OFF, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_STOP_ALL:
                this.onZoneCommand(MotionCommands.COMMAND_ALL_MOVE_STOP, req.ZoneID, 0, 0);
                break;
            case ActionTypes.ZONE_COMMAND_FORCE_RESERVE:
                this.onZoneCommand(MotionCommands.COMMAND_RESERVE_TASK_ID, req.ZoneID, 0, 0, req.TaskID);
                break;
            case ActionTypes.HIM_FORCE_INSTALL_CARRIER:
                Service.Inst.Redis.publish(`TCMCmdCh:${Math.floor(req.ZoneID / 100)}`, MsgUtils.makeHimForceInstallCarrier(req.ZoneID, req.CarrierID));
                break;
            case ActionTypes.ZONE_COMMAND_CHANGE_LOCATION:
                this.onPostRelocation(req.TaskID, req.ZoneIDCurrent, req.NewLocation);
                break;
            case ActionTypes.ZONE_COMMAND_REINSTALL:
                this.onPostReInstall(req.TaskID, req.ZoneIDCurrent);
                break;
            case ActionTypes.CHANGE_OFFSET_MOVE_RELATIVE_QS:
                this.onZoneCommand(MotionCommands.COMMAND_MOVE_REL, req.ZoneID, 0, req.Position);
                break;
            case ActionTypes.CHANGE_OFFSET_SELECTED_QS:
                this.onZoneCommand(MotionCommands.COMMAND_OFFSET_APPLY, req.ZoneID, req.OffsetType, req.Position);
                break;
            case ActionTypes.ZONE_COMMAND_DEFAULT_DESTNATION:
                Service.Inst.Redis.publish(`TCMCmdCh:${Math.floor(req.ZoneID / 100)}`, MsgUtils.makeMessageUimZoneUserAttributes(-1, req.DefaultDest, req.ZoneID));
                break;
            case ActionTypes.READ_RFID:
                this.onZoneCommand(MotionCommands.COMMAND_TEST_RFID, req.ZoneID, -1, -1, req.TaskID);
                break;
            case ActionTypes.COMMAND_SET_SAFE_LOCK:
                this.onZoneCommand(MotionCommands.COMMAND_SET_SAFE_LOCK, req.ZoneID, req.MoveType, -1, -1);
                break;
            case ActionTypes.ZONE_COMMAND_ALL_MOVE_VEL:
                this.onZoneCommand(MotionCommands.COMMAND_ALL_MOVE_VEL, req.ZoneID, req.MoveType, 0);
                break;
            default:
                logger.error(`onZoneMessage: Unknown message type: ${type}, body: ${req}`);
                break;
        }
    }

    onZoneCommand(commandId: number, zoneId: number, direction: number, position: number, taskId = -1) {
        const speedType = 1;
        const channel = `TCMCmdCh:${Math.floor(zoneId / 100)}`;

        if (commandId > 0) {
            const message = MsgUtils.makeTcmMotionCommand(taskId, zoneId, commandId, speedType, direction, position);
            Service.Inst.Redis.publish(channel, message);
        }
    }

    onPostRelocation(TaskID:number, OldZoneID:number, NewZoneID:number) {
        const channel = `TCMCmdCh:${Math.floor(NewZoneID / 100)}`;
        const message = MsgUtils.makeMessageUimCarrierRelocation(TaskID, OldZoneID, NewZoneID);
        const redisClient = Service.Inst.Redis;
        redisClient.publish(channel, message);
        redisClient.hset(`Zone:${NewZoneID}:DynamicAttributes`, 'ReservedTaskID', TaskID);
        redisClient.hset(`TransferInfo:${TaskID}`, 'Location', NewZoneID);
    }

    onTaskMessage(type: ActionTypes, req:TaskCmdReq) {
        switch(type) {
            case ActionTypes.TASK_COMMAND_PAUSE:
            case ActionTypes.TASK_COMMAND_RESUME:
            case ActionTypes.TASK_COMMAND_ABORT:
            case ActionTypes.TASK_COMMAND_RECOVERY:
            case ActionTypes.ZONE_COMMAND_RESUME_ALL:
            case ActionTypes.ZONE_COMMAND_PAUSE_ALL:
                this.onTaskCommand(type, req.TaskID);
                break;
            case ActionTypes.ZONE_COMMAND_RECOVERY_ALL:
                this.onTaskCommand(ActionTypes.ZONE_COMMAND_RECOVERY_ALL, 0);
                break;
        }
    }

    onTaskCommand(command:ActionTypes, taskID:number) {
        let message;
        switch (command) {
            case ActionTypes.TASK_COMMAND_PAUSE:
                message = MsgUtils.makeHimChangeCmdReq(taskID, TaskCommnds.TASK_PAUSE);
                break;
            case ActionTypes.TASK_COMMAND_ABORT:
                message = MsgUtils.makeHimChangeCmdReq(taskID, TaskCommnds.TASK_ABORT);
                break;
            case ActionTypes.TASK_COMMAND_RESUME:
                message = MsgUtils.makeHimChangeCmdReq(taskID, TaskCommnds.TASK_RESUME);
                break;
            case ActionTypes.TASK_COMMAND_RECOVERY:
                message = MsgUtils.makeHimChangeCmdReq(taskID, TaskCommnds.TASK_RECOVER);
                break;
            case ActionTypes.ZONE_COMMAND_RESUME_ALL:
                message = MsgUtils.makeHimChangeCmdReq(0, TaskCommnds.TASK_RESUME_ALL);
                break;
            case ActionTypes.ZONE_COMMAND_PAUSE_ALL:
                message = MsgUtils.makeHimChangeCmdReq(0, TaskCommnds.TASK_PAUSE_ALL);
                break;
            case ActionTypes.ZONE_COMMAND_RECOVERY_ALL:
                message = MsgUtils.makeHimChangeCmdReq(0, TaskCommnds.TASK_RECOVERY_ALL);
                break;
            default:
                break;
        }
    
        if (message) {
            Service.Inst.Redis.rpush('DCMCmdList', message);
        }
    }

    async onEquipComStateChange(type:ActionTypes, req:StateChangeReq) {
        let connState = -1;
        let controlState = -1;
        switch(type) {
            case ActionTypes.EQUIPMENT_STATE_CHANGE_COMM_DISABLE:
                connState = 0;
                controlState = -1;
                break;
            case ActionTypes.EQUIPMENT_STATE_CHANGE_COMM_ENABLE:
                connState = 1;
                controlState = -1;
                break;
            case ActionTypes.EQUIPMENT_STATE_CHANGE_CONTROL_OFFLINE:
                connState = -1;
                controlState = 0;
                break;
            case ActionTypes.EQUIPMENT_STATE_CHANGE_CONTROL_ONLINE_LOCAL:
                connState = -1;
                controlState = 1;
                break;
            case ActionTypes.EQUIPMENT_STATE_CHANGE_CONTROL_ONLINE_REMOTE:
                connState = -1;
                controlState = 2;
                break;
            default:
                throw new Error(`Unknown message type: ${type}`);
        }
        const body = MsgUtils.makeMessageUimEquipmentStateChangeReq(connState, controlState, req.SelectedNetwork);
        Service.Inst.Redis.publish('FromUIMCh', body);

    }

    onPostReInstall(taskID:number, zoneID:number) {
        const channel = `TCMCmdCh:${Math.floor(zoneID / 100)}`;
        const message = MsgUtils.makeMessageUimCarrierReInstall(taskID);
        Service.Inst.Redis.publish(channel, message);
    }

    async onPostClearAlarm(alarmSerialNo:number) {
        const key = `System:Alarm:Record:${alarmSerialNo}`;
        const redisClient = Service.Inst.Redis;
        const reply = await redisClient.hget(key, 'Location');
        if (reply) {
            const ch = `TCMCmdCh:${Math.floor(+reply / 100)}`;
            redisClient.publish(ch, MsgUtils.makeTcsAlarmClear(alarmSerialNo));
        } else {
            redisClient.publish('SCMCmdCh', MsgUtils.makeTcsAlarmClear(alarmSerialNo));
        }
    }

    onPostDestChangeCommand(taskID:number, zoneIDTo:number, zoneIDJunction:number) {
        const isPause = zoneIDTo === 0 && zoneIDJunction === 0;
        const channel = 'DCMCmdList';
        const message = MsgUtils.makeHimChangeCmdReq(
            taskID,
            isPause ? 'Pause' : 'DestChange',
            '',
            zoneIDTo.toString(),
            zoneIDJunction !== -1 ? zoneIDJunction.toString() : '',
        );
        Service.Inst.Redis.rpush(channel, message);
    }

    onPostReverseDestChangeCommand(taskID:number, zoneIDTo:number, zoneIDJunction:number) {
        const channel = 'DCMCmdList';
        const message = MsgUtils.makeHimChangeCmdReq(
            taskID,
            'ReverseDestChange',
            '',
            zoneIDTo.toString(),
            zoneIDJunction !== -1 ? zoneIDJunction.toString() : '',
        );
        Service.Inst.Redis.rpush(channel, message);
    }
    
    onPostReorderCommand(taskID:number) {
        const channel = 'DCMCmdList';
        const message = MsgUtils.makeHimChangeCmdReq(taskID, 'Reorder');
        Service.Inst.Redis.rpush(channel, message);
    }

    onControlModule(command:number, module:number, id:number) {
        Service.Inst.Redis.publish('FromUIMCh', MsgUtils.makeMessageUimControlModule(command, module, id));
    }
}
