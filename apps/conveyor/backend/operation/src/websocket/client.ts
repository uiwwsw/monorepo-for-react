import WebSocket from 'ws';

import { WebSocketMessage, UserSession } from '@package-backend/types';
import { initailizeRedisInfo } from './redis_utils';
import { ActionTypes } from './action_type';
import { ZoneType } from '../zone/zoneType';
import { MotionCommands, MotionCommandReq } from './motion_commands';
import { Service } from '../service';
import * as MsgUtils from './message';
import * as utils from '../libs/utils';
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
                        {
                            const req:MotionCommandReq = JSON.parse(msg.data);
                            this.onZoneCommand(MotionCommands.COMMAND_HOMMING, req.ZoneID, 0, 0);
                        }
                        break;
                    case ActionTypes.ZONE_COMMAND_MOVE:
                        {
                            const zoneRepo = Service.Inst.ZoneRepo;
                            let direction = 0;
                            const req:MotionCommandReq = JSON.parse(msg.data);
                            const zone = zoneRepo.Data.get(req.ZoneID);
                            if (!zone) {
                                throw new Error(`Zone not found. zone_id:${req.ZoneID}`);
                            }
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
                    default:
                        logger.warn(`Unknown message type: ${msg.type}, body: ${msg.data}`);
                        break;
                }
            } catch (err) {
                logger.error(`Failed to process uid:${this.session.uid} message: ${msg.type}, body: ${msg.data}`);
                result = (err as Error).message;
            }
    
            if (msg.tid) {
                this.send('MessageResult', { result: result, tid: msg.tid });
            }
            const end = new Date().getTime();
            logger.debug(`onRecvMessage. uid:${this.session.uid}, type:${msg.type}, data:${msg.data}, result:${result}, elapsed:${end - begin}ms`);
        } catch (ex) {
            logger.error(`onRecvMessage. uid:${this.session.uid}, body:${body} ex: ${ex}`);
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
}
