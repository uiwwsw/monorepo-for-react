import WebSocket from 'ws';
import { Redis } from 'ioredis';

import { getSessionFromToken } from '../routes/session';
import { ITaskTransferInfoMessage } from '../models/taskTransferInfo';
import { ITcsEventSet } from '../models/tcsEventSet';
import { initailizeRedisInfo } from './redis_utils';
import logger from '../libs/logger';
import * as utils from '../libs/utils';

export class Clients {
    private clients: Map<number, WebSocket> = new Map<number, WebSocket>();

    private subs!: Redis;
    private tcsEventSet:ITcsEventSet[] = [];
    private tcmTransferInfo:ITaskTransferInfoMessage[] = [];
    private tcmZoneStateAttributes:unknown[] = [];
    private tcmZoneOccupiedAttributes:unknown[] = [];

    public constructor(redis:Redis) {
        this.subs = redis;

        this.subs.subscribe('AlarmEventCh');
        this.subs.subscribe('AlarmEventCh');
        this.subs.subscribe('TransferInfoCh');
        this.subs.subscribe('UIMCh');
        this.subs.psubscribe('TCMZoneCh:*');

        this.subs.on('message', (channel, message) => {
            this.onRecvMessage(channel, message);
        });

        this.subs.on('pmessage', (pattern, channel, message) => {
            this.onRecvMessage(channel, message);
        });

        setTimeout(this.sendRunner, 200);
    }

    // Redis 메시지 수신 이벤트 처리
    private async onRecvMessage(channel:string, message:string) {
        try {
            const msg = JSON.parse(message);
            switch(msg.MessageID){
                case 'tcmZoneStateAttributes':
                    this.tcmZoneStateAttributes.push(msg.MessageData);
                    break;
                case 'tcmZoneOccupiedAttributes':
                    this.tcmZoneOccupiedAttributes.push(msg.MessageData);
                    break;
                case 'tcmAlarmSet':
                    this.broadcast('tcmAlarmSet', msg.MessageData);
                    break;
                case 'tcmZoneStateChangeCompleted':
                    {
                        let newState = -1;
                        switch (msg.MessageData.NewState) {
                            case 'InService':
                                newState = 0;
                                break;
                            case 'OutOfService':
                                newState = 1;
                                break;
                            case 'Offline':
                                newState = 3;
                                break;
                            default:
                                break;
                        }
                        if (newState < 0) {
                            return;
                        }
                        this.broadcast('UpdateZoneState', [{ zoneID: msg.MessageData.ZoneID, newState }], true);
                    }
                    break;
                case 'tcsEventSet':
                    this.tcsEventSet.push(msg.MessageData as ITcsEventSet);
                    break;
                case 'tcsAlarmClear':
                case 'tcmAlarmCleared':
                    this.broadcast('tcsAlarmClear', msg.MessageData);
                    break;
                case 'tcsWarningSet':
                    this.broadcast('tcsWarningSet', msg.MessageData);
                    break;
                case 'tcmTransferInfo':
                    this.tcmTransferInfo.push(msg.MessageData);
                    break;
                case 'himEquipmentStateInfo':
                    this.broadcast('himEquipmentStateInfo', msg.MessageData.Object);
                    break;
            }
        } catch (ex) {
            logger.warn(`Received the following message from ${channel}: ${message}, ex: ${ex}`);
        }
    }

    public async addClient(ws: WebSocket, token: string) {
        const session = await getSessionFromToken(token);
        if (!session) {
            logger.error('addClient. Invalid auth token');
            ws.close();
            return;
        }

        await initailizeRedisInfo(ws);

        this.clients.set(session.uid, ws);
        logger.info(`addClient. A new WebSocket connection has been established. uid: ${session.uid}`);

        ws.on('close', () => {
            this.clients.delete(session.uid);
            logger.info(`The WebSocket connection has been terminated. uid: ${session.uid}`);
        });
    }

    public send(ws:WebSocket, type: string, data: string, compress: number) {
        const msg = {
            type: type,
            data: data,
            compress: compress
        };
        ws.send(JSON.stringify(msg));
    }

    public async broadcast(type: string, data: object, compress: boolean = false) {
        const message = compress ? await utils.compressAndEncodeBase64(data) : JSON.stringify(data)
        this.clients.forEach((c) => this.send(c, type, message, compress ? 1 : 0) );
    }

    private sendRunner = () => {
        try {
            if (this.tcmTransferInfo.length > 0) {
                const transferinfo = this.tcmTransferInfo.splice(0, this.tcmTransferInfo.length);
                this.broadcast('tcmTransferInfo', transferinfo, true);
            }
            if (this.tcmZoneOccupiedAttributes.length > 0) {
                const tcmZoneOccupied = this.tcmZoneOccupiedAttributes.splice(0, this.tcmZoneOccupiedAttributes.length);
                this.broadcast('UpdateZoneOccupiedState', tcmZoneOccupied, true);
            }
            if (this.tcmZoneStateAttributes.length > 0) {
                const tcmZoneOccupied = this.tcmZoneStateAttributes.splice(0, this.tcmZoneStateAttributes.length);
                this.broadcast('UpdateZoneState', tcmZoneOccupied, true);
            }
            if(this.tcsEventSet.length > 0){
                const eventSet = this.tcsEventSet.splice(0, this.tcsEventSet.length);
                this.broadcast('tcsEventSet', eventSet, true);
            }
        } catch (ex) {
            logger.error(`sendRunner: ${ex}`);
        } finally {
            setTimeout(this.sendRunner, 200);
        }
    }
}
