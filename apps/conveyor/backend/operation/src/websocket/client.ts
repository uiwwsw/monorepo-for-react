import WebSocket from 'ws';

import { WebSocketMessage, UserSession } from '@package-backend/types';
import * as utils from '../libs/utils';

export class Client {
    private client: WebSocket;
    private session: UserSession;

    public constructor(client: WebSocket, session : UserSession) {
        this.client = client;
        this.session = session;
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
            this.client.send(JSON.stringify(msg));
        } else {
            const msg:WebSocketMessage = {
                type: type,
                data: json,
                compress: 0
            };
            this.client.send(JSON.stringify(msg));
        }
    }

    public get ClientType() : number {
        return this.session.client_type;
    }
}