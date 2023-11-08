export interface Zone {
  VersionInfo: string;
  EquipmentConfig: EquipmentConfig;
  GEMConfig: GEMConfig;
  TCMConfigAll: TCMConfigAll;
  TCMConfig: TCMConfig[];
  ZoneList: ZoneList[];
  IdlerList: unknown[];
  GroupPort: GroupPort[];
  LoopPort: unknown[];
  VirtualPort: unknown[];
  NodeMapList: NodeMapList[];
  UseRealPostion: boolean;
  UserAdmin: UserAdmin;
  UserOperator: UserOperator;
  UserTester: UserTester;
  UserUser: UserUser;
  CCTVList: unknown[];
}

export interface EquipmentConfig {
  EquipmentModel: string;
  EquipmentName: string;
  TransferTimeout: string;
}

export interface GEMConfig {
  GEMServerPort: string;
  DeviceID: string;
}

export interface TCMConfigAll {
  LifterFollowerZoneCount: number;
  UseLimit: number;
  UseRepositionQS: number;
  WriteRedisSensorLog: number;
  TimerAutoHome: number;
  TimerRetry: number;
  ReadRFIDDirection: number;
  TimerCarrierLost: number;
  TimerCarrierFound: number;
  TCMSC_ServerAliveCount: number;
  TCMSC_ClientAliveCount: number;
  TCMSC_ServerAliveInterval: number;
  TCMSC_ClientAliveInterval: number;
  UseCarrierFoundRetry: number;
  LifterEncoderRange: number;
  TimerLiftDstDelay: number;
  E84Timer_TA1: number;
  E84Timer_TP1: number;
  E84Timer_TP2: number;
  E84Timer_TP3: number;
  E84Timer_TP4: number;
  E84Timer_TP5: number;
  E84Timer_TP6: number;
}

export interface TCMConfig {
  TCMID: string;
  IPAddress: string;
  ServerPort: string;
  HandOffByClient: string;
  Setting: Setting;
}

export interface Setting {
  LifterFollowerZoneCount?: number;
  TimerLDSensorEnterSlow?: number;
}

export interface ZoneList {
  Level: number;
  posX: number;
  posY: number;
  ZoneDrawCount: number;
  NextZone: number;
  PrevZone: number;
  EtherCATID: number;
  EtherCATName: string;
  MotorReverse: number;
  GearRatio: number;
  PLCSlaveID: number;
  Profile: Profile;
  ZoneID: number;
  DisplayName: string;
  RefDirection: number;
  PhysicalType: number;
  CurrentNode?: number;
  PrevNode?: number;
  AttributeLD?: AttributeLd;
  AttributeQS?: AttributeQs;
  DiscriminationNode?: number[];
  AttributeLifter?: AttributeLifter;
  LogicalType?: number;
}

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

export interface AttributeLd {
  Included?: number;
  GroupNumber?: number;
  E84PortNumber?: number;
  RFIDPortNumber?: number;
  SGTPortNumber?: number;
  IOModuleInstalled?: number;
  IOEtherCATID?: string;
  SensorReversZones?: number[];
  DefaultOutputZoneID?: number;
}

export interface AttributeQs {
  Included: number;
  HomeOffset: number;
  NegativeOffset: number;
  PositiveOffset: number;
  North?: string[];
  West?: string[];
  East?: string[];
  HomeDirection: number;
  IsWayPoint: number;
  South?: string[];
}

export interface AttributeLifter {
  InIncludeZoneID: number;
  OutIncludeZoneID: number;
  HomeLevel: number;
  HomingDirection: number;
  HomingClearLimit: number;
  HomeOffset: number;
  IOEtherCATID: number;
  IOModuleInstalled: number;
  LevelZone: LevelZone[];
}

export interface LevelZone {
  In: number;
  Out: number;
  Position: number;
}

export interface GroupPort {
  Head: number;
  PathFindOption: number;
  Name: string;
  Members: Member[];
}

export interface Member {
  ZoneID: number;
  Priority: number;
}

export interface NodeMapList {
  StartNode: number;
  Members: number[];
  EndNode: number;
}

export interface UserAdmin {
  Password: string;
  Auth: string;
}

export interface UserOperator {
  Password: string;
  Auth: string;
}

export interface UserTester {
  Password: string;
  Auth: string;
}

export interface UserUser {
  Password: string;
  Auth: string;
}

export interface statsZone {
  displayName: string;
  zoneID: number;
  alarmNum: number;
  carrierNum: number;
  warningNum: number;
}
