export interface WebSocketMessage {
    msg_id : string;
    msg_body : string;
    body_type : number;      // 1: JSON, 2: COMPRESS-JSON
}
