import { RowDataPacket } from 'mysql2';

export interface UserRow extends RowDataPacket {
    uid : number;
    user_id : string;
    password : string;
    user_name : string;
    grade : number;
    created_date : Date;
    last_access : Date;
    session : string;
}

export interface AlarmCodeInfoRow extends RowDataPacket {
    No : number;
    AlarmCode : number;
    Discription : string;
}

export interface AlarminfoRow extends RowDataPacket {
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

export interface CompleteCarrierRow extends RowDataPacket {
    No : number;
    ZoneID : number;
    UseCount : number;
    TimeStamp : Date;
}

export interface CompletecarrierCountRow extends RowDataPacket {
    No : number;
    CarrierID : number;
    ZoneID : string;
    TimeStamp : Date;
}

export interface DestinationCountRow extends RowDataPacket {
    No : number;
    ZoneIDFrom : number;
    TimeStamp : Date;
    ZoneID : number;
}

export interface DestinationZoneRow extends RowDataPacket {
    No : number;
    ZoneID : number;
    UseCount : number;
    TimeStamp : Date;
}

export interface E84JobsRow extends RowDataPacket {
    No : number;
    StartTIme : Date;
    E84JobID : number;
    ZoneID : number;
    EndTime : Date;
}

export interface E84JobStatesRow extends RowDataPacket {
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

export interface LogsRow extends RowDataPacket {
    No : number;
    TimeStamp : Date;
    Level : number;
    TCMID : number;
    TaskID : number;
    ZoneID : number;
    Comment : string;
}

export interface OperationLogsRow extends RowDataPacket {
    No : number;
    IPAddres : string;
    comment : string;
    TimeStamp : Date;
}

export interface TaskTransferInfoRow extends RowDataPacket {
    No : number;
    TaskID : number;
    ZoneIDTo : number;
    CommandID : string;
    CarrierID : string;
    ZoneIDFrom : number;
    StartTime : Date;
    EndTime : Date;
}

export interface TaskTransferInfoStatusRow extends RowDataPacket {
    No : number;
    TaskID : number;
    State : string;
    ZoneIDCurrent : number;
    TimeStamp : Date;
}

export interface WarningCodeInfoRow extends RowDataPacket {
    No : number;
    WarningCode : number;
    Discription : string;
}

export interface WarningInfoRow extends RowDataPacket {
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

export interface ZoneDynamicAttributesRow extends RowDataPacket {
    No : number;
    TimeStamp : Date;
    ZoneID : number;
    State : number;
    PrevState : number;
    MotorState : number;
}

export interface ZoneInfoRow extends RowDataPacket {
    No : number;
    ZoneID : number;
    DisplayName : string;
    PhysicalType : number;
}

export interface ZoneOccupiedAttributesRow extends RowDataPacket {
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

export interface MsgQueueRow extends RowDataPacket {
    No : number;
    Date : Date;
    State : number;
    Channel : string;
    Message : string;
    Result : string;
}