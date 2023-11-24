export interface Profile {
    MaintVel: number;
    MaintAcc: number;
    MaintDcc: number;
    MaintJerk: number;
    RunFastVel: number;
    RunFastAcc: number;
    RunFastDcc: number;
    RunFastJerk: number;
    RunSlowVel: number;
    RunSlowAcc: number;
    RunSlowDcc: number;
    RunSlowJerk: number;
    OverrideVel: number;
    OverrideAcc: number;
    OverrideDcc: number;
    OverrideJerk: number;
}

export interface AttributeQS {
    Included?: number;
    East?: unknown;
    West?: unknown;
    North?: unknown;
    South?: unknown;
    HomeOffset?: unknown;
}

export interface AttributeLD {
    IOModuleInstalled?: number;
    E84PortNumber?: number;
    RFIDPortNumber?: number;
    SGTPortNumber?: number;
    IOEtherCATID?: string;
    AutoIOPort?: number;
    DefaultOutputZoneID?: number;
    SensorReversZones?: number[];
    Included?: number;
    GroupNumber?: number;
}

export interface AttributePurge {
    E84PortNumber?: number;
    RFIDPortNumber?: number;
    IOEtherCATID?: string;
}

export interface LevelZone {
    In: number;
    Out: number;
    Position: number;
}

export interface AttributeLifter {
    InIncludeZoneID?: number;
    OutIncludeZoneID?: number;
    HomeLevel?: number; //0 = Down, 1 = Up
    HomingDirection?: number; //0 = Down, 1 = Up
    HomingClearLimit?: number; //0 = Down, 1 = Up
    HomeOffset?: number;
    IOEtherCATID?: number;
    IOModuleInstalled?: number;
    LevelZone?: LevelZone[];
}

export interface AttributeSingleLifter {
    Included: number;
    HomeLevel: number; //0 = Down, 1 = Up
    HomingDirection: number; //0 = Down, 1 = Up
    HomingClearLimit: number; //0 = Down, 1 = Up
    IOModuleInstalled?: number;
    IOEtherCATID?: number;
    HomeOffset: number;
    LevelZone?: LevelZone[];
}

export class baseObject {
    ZoneID: number;
    DisplayName?: string;
    Level: number = 0; //Default 0;
    RefDirection?: number; // up 0 / down 1 / left 2 / right 3
    posX: number = 0;
    posY: number = 0;
    ZoneDrawCount?: number = 1;
    PhysicalType?: number;
    NextZone: number = -1;
    PrevZone: number = -1;

    constructor(zoneId: number = 0) {
        this.ZoneID = zoneId;
    }
}

export class cctv extends baseObject {
    TCMID?: number;
    IPAddress?: string;
    rotationDeg?: number;
}

export class idler extends baseObject {
    constructor(zoneId: number) {
        super(zoneId);
    }
}

/** zone Redis의 기본 정보를 따라 구성 된다*/
export class Zone extends baseObject {
    LogicalType?: number;
    EtherCATID: number = 0;
    EtherCATName: string = '';
    PrevNode?: number;
    CurrentNode?: number;
    MotorReverse?: number = 1;
    SensorReverseZone?: number;
    HomeOffset?: number;
    GearRatio: number = 400;

    Profile: Profile;

    AttributeQS?: AttributeQS;
    AttributeLifter?: AttributeLifter;
    AttributeSingleLifter?: AttributeSingleLifter;
    PLCSlaveID: number = -1;
    IncludedZone?: unknown;
    HasAirShower?: number;

    /**INPUT OUTPUT */
    AttributeLD?: AttributeLD;
    DiscriminationNode?: number[];

    AttributePurge?: AttributePurge;

    constructor(zoneId: number) {
        super(zoneId);
        this.Profile = {
            MaintVel: 100,
            MaintAcc: 1750,
            MaintDcc: 3000,
            MaintJerk: 60000,
            RunFastVel: 800,
            RunFastAcc: 1325,
            RunFastDcc: 1850,
            RunFastJerk: 25000,
            RunSlowVel: 470,
            RunSlowAcc: 800,
            RunSlowDcc: 510,
            RunSlowJerk: 40000,
            OverrideVel: 80,
            OverrideAcc: 1325,
            OverrideDcc: 1100,
            OverrideJerk: 22000,
        };
    }
}
