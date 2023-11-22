import { IAlarminfoRow } from "../data";

// 반송 지표 요청
export interface CarrierStatsInRequest {
    start_time : Date;
    end_time : Date;
    page : number;
    page_size? : number; // default 30
    find_key? : string;
}

export interface CarrierStatsRow {
    TaskID? : number;
    ZoneIDTo? : number;
    CommandID? : string;
    CarrierID? : string;
    ZoneIDFrom? : number;
    StartTime? : Date;
    EndTime? : Date;
    ZoneIDToName? : string;
    ZoneIDFromName? : string;
}

// 반송 지표 응답
export interface CarrierStatsResponse {
    rows : CarrierStatsRow[];
    total_count : number;
}

// 알람 지표 요청
export interface AlarmStatsInRequest {
    start_time : Date;
    end_time : Date;
    page : number;
    page_size? : number; // default 30
    find_key? : string;
}
// 알람 지표 응답
export interface AlarmStatsResponse {
    rows : IAlarminfoRow[];
    total_count : number;
}


// Zone 지표 요청
export interface ZoneStatsInRequest {
    start_time : Date;
    end_time : Date;
}
export interface ZoneStatsItem {
    date? : string;
    zoneId? : number;
    carrierNum? : number;
    alarmNum? : number;
    warningNum? : number;
}
// Zone 지표 응답
export interface ZoneStatsResponse {
    rows : ZoneStatsItem[];
}
