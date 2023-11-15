export interface IUser {
    uid : number;
    user_id : string;
    password : string;
    user_name : string;
    grade : number;
    created_date : Date;
    last_access : Date;
    session : string;
}

export interface IAlarmCodeInfo {
    No : number;
    AlarmCode : number;
    Discription : string;
}

export interface IAlarminfo {
    No : number;
    SerialNo : number;
    AlarmCode : number;
    TaskID : number;
    Location : number;
    Reason : number;
    CommandID : string;
    TCMID : number;
    CarrierID : string;
    SetTime : Date;
    ClearTime : Date;
}

export interface ICompleteCarrier {
    No : number;
    ZoneID : number;
    UseCount : number;
    TimeStamp : Date;
}

export interface ICompletecarrierCount {
    No : number;
    CarrierID : number;
    ZoneID : string;
    TimeStamp : Date;
}

export interface IDestinationCount {
    No : number;
    ZoneIDFrom : number;
    TimeStamp : Date;
    ZoneID : number;
}

export interface IDestinationZone {
    No : number;
    ZoneID : number;
    UseCount : number;
    TimeStamp : Date;
}

export interface IE84Jobs {
    No : number;
    StartTIme : Date;
    E84JobID : number;
    ZoneID : number;
    EndTime : Date;
}

export interface IE84JobStates {
    No : number;
    Timestamp : Date;
    E84JobID : number;
    SequenceState : number;
    L_REQ : number;
    U_REQ : number;
    READY : number;
    HO_AVBL : number;
    ES : number;
    VALID : number;
    CS_0 : number;
    TR_REQ : number;
    BUSY : number;
    COMPT : number;
}

export interface ILogs {
    No : number;
    TimeStamp : Date;
    Level : number;
    TCMID : number;
    TaskID : number;
    ZoneID : number;
    Comment : string;
}

export interface IOperationLogs {
    No : number;
    IPAddres : string;
    comment : string;
    TimeStamp : Date;
}

export interface ITaskTransferInfo {
    No : number;
    TaskID : number;
    ZoneIDTo : number;
    CommandID : string;
    CarrierID : string;
    ZoneIDFrom : number;
    StartTime : Date;
    EndTime : Date;
}

export interface ITaskTransferInfoStatus {
    No : number;
    TaskID : number;
    State : string;
    ZoneIDCurrent : number;
    TimeStamp : Date;
}

export interface IWarningCodeInfo {
    No : number;
    WarningCode : number;
    Discription : string;
}

export interface IWarningInfo {
    No : number;
    SerialNo : number;
    WarningCode : number;
    TaskID : number;
    Location : number;
    Reason : number;
    CommandID : string;
    CarrierID : string;
    SetTime : Date;
}

export interface IZoneDynamicAttributes {
    No : number;
    TimeStamp : Date;
    ZoneID : number;
    State : number;
    PrevState : number;
    MotorState : number;
}

export interface IZoneInfo {
    No : number;
    ZoneID : number;
    DisplayName : string;
    PhysicalType : number;
}

export interface IZoneOccupiedAttributes {
    No : number;
    TimeStamp : Date;
    ZoneID : number;
    ReservedTaskID : number;
    OccupiedSensor1 : number;
    OccupiedSensor2 : number;
    OccupiedSensor3 : number;
    CurrentDirection : number;
    CurrentLevel : number;
    AlarmSerialNumber : number;
}

export interface IMsgQueue {
    No : number;
    Date : Date;
    State : number;
    Channel : string;
    Message : string;
    Result : string;
}