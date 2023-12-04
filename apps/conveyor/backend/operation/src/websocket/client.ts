import WebSocket from 'ws';

import { WebSocketMessage, UserSession } from '@package-backend/types';
import { initailizeRedisInfo } from './redis_utils';
import { ActionTypes } from './action_type';
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
        } catch (ex) {
            logger.error(`onRecvMessage. uid:${this.session.uid}, body:${body} ex: ${ex}`);
        }
    }
}
