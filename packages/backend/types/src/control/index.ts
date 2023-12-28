export interface ProcessingStateRequest {
    password : string;      // 사용자 비밀번호 (MD5 해시)
    state : string;         // 1: Paused, 2: Auto
}

export interface ProcessingStateResponse {
}
