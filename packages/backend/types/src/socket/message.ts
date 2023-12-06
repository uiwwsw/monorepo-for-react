export interface WebSocketMessage {
    type : string;
    data : string;
    compress : number;      // 1: JSON -> GZIP -> BASE64
    tid? : number;          // Transaction ID(Ack가 필요한 경우 사용)
}

export interface MessageResult {
    result : string;
    type : string;
    tid : number;
}

export interface ModuleState {
    // Type: initialmodulestate
    StateType: string;
    ID: string;             // TCM only assignment
    Alive: number;          // 1: Alive, 0: Dead
}

export interface AlarmClearReq {
    // Type: TCM_ALARM_CLEAR
    SerialNo: number;
}

export interface ChangeDestReq {
    // Type: ZONE_COMMAND_CHANGE_DESTINATION
    TaskID: number;
    DestniZone: number;
    ZoneIDJunctions: number;
}

export interface ControlModuleReq {
    TCM_ID: number;
}

export interface StateChangeReq {
    SelectedNetwork: number
}

export interface SignalTowerReq {
    TCM_ID: number;
    Buzzer: number;
}

export interface ParamPayload {
    profileType : number;
    zoneID : number;
    speedType : number;
    velocity : number;
    acceleration : number;
    deceleration : number;
    jerk : number;
    overrideDelay : number;
    dccRatio : number;
}

export interface ChangeParamReq {
    payload : ParamPayload;
}

export interface EquipmentStateObject {
    CommState: string;          // 
    ControlState: string;       // 
    ProcessingState: string;    // 
}

export interface EquipmentState {
    // Recv Type: himEquipmentStateInfo
    MCS1: EquipmentStateObject; // 1번 MCS
    MCS2: EquipmentStateObject; // 2번 MCS (YMTC의 경우 MCS가 2개 연결 됨)
}

export interface TCMInfo {
    // Recv Type: TCMInfo
    TCMID: string;
    IPAddress: string;
    BuildNum: string;
    BuildDate: string;
}

export interface AlarmInfoObject {
    SerialNo: number;
    AlarmCode: string;
    TaskID: string;
    Location: string;
    Reason: string;
    CommandID: string;
    CarrierID: string;
    Time: string;
}

export interface AlarmInfo {
    // Type: tcmAlarmSet
    BaseTime: string;
    Object: AlarmInfoObject;
}

export interface WarningInfo {
    // Type: tcsWarningSet
    CommandID: string;
    CarrierID: string;
    Time: string;
    TaskID: string;
    SerialNo: number;
    EventCode: string;
    Location: string;
    Reason: string;
    BaseTime: string;
}
