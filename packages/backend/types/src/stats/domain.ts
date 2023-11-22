
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
