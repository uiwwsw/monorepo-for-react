export enum MotionCommands {
    COMMAND_RESERVED = 0,
    COMMAND_SERVO_ON,
    COMMAND_SERVO_OFF,
    COMMAND_MOVE_VEL,
    COMMAND_MOVE_REL,
    COMMAND_MOVE_ABS,
    COMMAND_MOVE_STOP,
    COMMAND_ALL_SERVO_ON,
    COMMAND_ALL_SERVO_OFF,
    COMMAND_ALL_MOVE_STOP,
    DEP_COMMAND_ALL_RESET,
    DEP_COMMAND_SENSOR2_NGELIMIT,
    DEP_COMMAND_SENSOR2_LIMIT_CLEAR,
    DEP_COMMAND_SENSOR2_POSLIMIT,
    COMMAND_ALL_OVERRIDE_CLEAR,
    COMMAND_SET_OVERRIDE,
    COMMAND_CLEAR_OVERRIDE,
    COMMAND_MOVE_TURN,
    COMMAND_MOVE_LIFT,
    COMMAND_RESET,
    COMMAND_HOMMING,
    COMMAND_OFFSET_APPLY,
    COMMAND_ALL_HOMMING,
    COMMAND_RESERVE_TASK_ID,
    COMMAND_SENSOR1_NGELIMIT,
    COMMAND_SENSOR1_LIMIT_CLEAR,
    COMMAND_CLEAR_ALL_MOTOR_ERROR,
    COMMAND_SET_LIMIT_POSITIVE,
    COMMAND_SET_LIMIT_NEGATIVE,
    COMMAND_SET_LIMIT_CLEAR,
    COMMAND_TEST_RFID,
    COMMAND_RESERVE_UNRESERVE_ZONE,
    COMMAND_SET_SAFE_LOCK,
    COMMAND_SET_OVERRIDE_SPEED,
    COMMAND_SYSTEM_RESET,
    COMMAND_ALL_MOVE_VEL,
}

export interface ZoneCmdReq {
    ZoneID : number;
    MoveType : number;
    Position : number;
    TaskID : number;
    CarrierID : string;
    OffsetType : number;
    ZoneIDCurrent: number;
    NewLocation: number;
    DefaultDest: number;
}

export interface TcmMotionCommand {
    BaseTime: Date;
    AutoCommand: number;
    TaskID: number;
    ZoneID: number;
    Command: number;
    SpeedType: number;
    Direction: number;
    Position: number;
}
