export interface IUserRow {
    uid? : number;
    user_id? : string;
    password? : string;
    user_name? : string;
    grade? : number;
    created_date? : Date;
    last_access? : Date;
    session? : string;
}

export interface IAlarmCodeInfoRow {
    No? : number;
    AlarmCode? : number;
    Discription? : string;
}

export interface IAlarminfoRow {
    No? : number;
    SerialNo? : number;
    AlarmCode? : number;
    TaskID? : number;
    Location? : number;
    Reason? : number;
    CommandID? : string;
    TCMID? : number;
    CarrierID? : string;
    SetTime? : Date;
    ClearTime? : Date;
}

export interface ICompleteCarrierRow {
    No? : number;
    ZoneID? : number;
    UseCount? : number;
    TimeStamp? : Date;
}

export interface ICompletecarrierCountRow {
    No? : number;
    CarrierID? : number;
    ZoneID? : string;
    TimeStamp? : Date;
}

export interface IDestinationCountRow {
    No? : number;
    ZoneIDFrom? : number;
    TimeStamp? : Date;
    ZoneID? : number;
}

export interface IDestinationZoneRow {
    No? : number;
    ZoneID? : number;
    UseCount? : number;
    TimeStamp? : Date;
}

export interface IE84JobsRow {
    No? : number;
    StartTIme? : Date;
    E84JobID? : number;
    ZoneID? : number;
    EndTime? : Date;
}

export interface IE84JobStatesRow {
    No? : number;
    Timestamp? : Date;
    E84JobID? : number;
    SequenceState? : number;
    L_REQ? : number;
    U_REQ? : number;
    READY? : number;
    HO_AVBL? : number;
    ES? : number;
    VALID? : number;
    CS_0? : number;
    TR_REQ? : number;
    BUSY? : number;
    COMPT? : number;
}

export interface ILogsRow {
    No? : number;
    TimeStamp? : Date;
    EventCode? : string;
    Level? : number;
    TCMID? : number;
    TaskID? : number;
    ZoneID? : number;
    Comment? : string;
}

export interface IOperationLogsRow {
    No? : number;
    IPAddres? : string;
    comment? : string;
    TimeStamp? : Date;
}

export interface ITaskTransferInfoRow {
    No? : number;
    TaskID? : number;
    ZoneIDTo? : number;
    CommandID? : string;
    CarrierID? : string;
    ZoneIDFrom? : number;
    StartTime? : Date;
    EndTime? : Date;
}

export interface ITaskTransferInfoStatusRow {
    No? : number;
    TaskID? : number;
    State? : string;
    ZoneIDCurrent? : number;
    TimeStamp? : Date;
}

export interface IWarningCodeInfoRow {
    No? : number;
    WarningCode? : number;
    Discription? : string;
}

export interface IWarningInfoRow {
    No? : number;
    SerialNo? : number;
    WarningCode? : number;
    TaskID? : number;
    Location? : number;
    Reason? : number;
    CommandID? : string;
    CarrierID? : string;
    SetTime? : Date;
}

export interface IZoneDynamicAttributesRow {
    No? : number;
    TimeStamp? : Date;
    ZoneID? : number;
    State? : number;
    PrevState? : number;
    MotorState? : number;
}

export interface IZoneInfoRow {
    No? : number;
    ZoneID? : number;
    DisplayName? : string;
    PhysicalType? : number;
}

export interface IZoneOccupiedAttributesRow {
    No? : number;
    TimeStamp? : Date;
    ZoneID? : number;
    ReservedTaskID? : number;
    OccupiedSensor1? : number;
    OccupiedSensor2? : number;
    OccupiedSensor3? : number;
    CurrentDirection? : number;
    CurrentLevel? : number;
    AlarmSerialNumber? : number;
}

export interface IMsgQueueRow {
    No? : number;
    Date? : Date;
    State? : number;
    Channel? : string;
    Message? : string;
    Result? : string;
}

export interface IZoneStatsRow {
    seq_no? : number;
    date? : Date;
    zoneId? : number;
    carrierNum? : number;
    alarmNum? : number;
    warningNum? : number;
}

export interface IResourcesRow {
    seq_no? : number;
    date? : Date;
    did? : string;
    cpu? : number;
    memory? : number;
    disk? : number;
}