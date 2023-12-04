import WebSocket from 'ws';
import { Redis } from 'ioredis';

import { getSessionFromToken } from '../routes/session';
import { ITaskTransferInfoMessage } from '../models/taskTransferInfo';
import { ITcsEventSet } from '../models/tcsEventSet';
import { Client } from './client';
import logger from '../libs/logger';
import * as utils from '../libs/utils';

export class Clients {
    private clients: Map<number, Client> = new Map<number, Client>();

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
                    this.broadcast('tcmAlarmSet', [msg.MessageData]);
                    break;
                case 'tcsAlarmClear':
                case 'tcmAlarmCleared':
                    this.broadcast('tcsAlarmClear', msg.MessageData);
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
                        this.broadcast('UpdateZoneState', [{ zoneID: msg.MessageData.ZoneID, newState }]);
                    }
                    break;
                case 'tcsEventSet':
                    this.tcsEventSet.push(msg.MessageData as ITcsEventSet);
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
                case 'tcmTransferComplete':
                    logger.info('tcmTransferComplete');
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

        if (this.clients.get(session.uid)) {
            const prev = this.clients.get(session.uid);
            logger.error(`addClient. A WebSocket connection already exists. uid: ${session.uid}`);
            this.clients.delete(session.uid);
            prev?.close();
            await utils.sleep(1000);
        }

        const client = new Client(ws, session);
        this.clients.set(session.uid, client);
        logger.info(`addClient. A new WebSocket connection has been established. uid: ${session.uid}`);

        ws.on('close', () => {
            if (this.clients.get(session.uid)) {
                this.clients.delete(session.uid);
            }
            logger.info(`The WebSocket connection has been terminated. uid: ${session.uid}`);
        });
    }

    public async broadcast(type: string, data: object, toALL:boolean=true) {
        this.clients.forEach((client) => {
            if (client.IsReady) {
                if (toALL || client.ClientType !== 1) {
                    client.send(type, data);
                }
            }
        });
    }

    private sendRunner = () => {
        try {
            if (this.tcmTransferInfo.length > 0) {
                const transferinfo = this.tcmTransferInfo.splice(0, this.tcmTransferInfo.length);
                this.broadcast('tcmTransferInfo', transferinfo, false);
            }
            if (this.tcmZoneOccupiedAttributes.length > 0) {
                const tcmZoneOccupied = this.tcmZoneOccupiedAttributes.splice(0, this.tcmZoneOccupiedAttributes.length);
                this.broadcast('UpdateZoneOccupiedState', tcmZoneOccupied, false);
            }
            if (this.tcmZoneStateAttributes.length > 0) {
                const tcmZoneOccupied = this.tcmZoneStateAttributes.splice(0, this.tcmZoneStateAttributes.length);
                this.broadcast('UpdateZoneState', tcmZoneOccupied, false);
            }
            if(this.tcsEventSet.length > 0){
                const eventSet = this.tcsEventSet.splice(0, this.tcsEventSet.length);
                this.broadcast('tcsEventSet', eventSet);
            }
        } catch (ex) {
            logger.error(`sendRunner: ${ex}`);
        } finally {
            setTimeout(this.sendRunner, 200);
        }
    }
}
