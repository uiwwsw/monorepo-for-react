export const mockDataGraph = [
  {
    id: 'japan',
    color: 'hsl(248, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 144,
      },
      {
        x: 'helicopter',
        y: 116,
      },
      {
        x: 'boat',
        y: 289,
      },
      {
        x: 'train',
        y: 113,
      },
      {
        x: 'subway',
        y: 111,
      },
      {
        x: 'bus',
        y: 212,
      },
      {
        x: 'car',
        y: 77,
      },
      {
        x: 'moto',
        y: 293,
      },
      {
        x: 'bicycle',
        y: 192,
      },
      {
        x: 'horse',
        y: 115,
      },
      {
        x: 'skateboard',
        y: 236,
      },
      {
        x: 'others',
        y: 121,
      },
    ],
  },
  {
    id: 'france',
    color: 'hsl(148, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 160,
      },
      {
        x: 'helicopter',
        y: 246,
      },
      {
        x: 'boat',
        y: 79,
      },
      {
        x: 'train',
        y: 122,
      },
      {
        x: 'subway',
        y: 235,
      },
      {
        x: 'bus',
        y: 133,
      },
      {
        x: 'car',
        y: 181,
      },
      {
        x: 'moto',
        y: 196,
      },
      {
        x: 'bicycle',
        y: 73,
      },
      {
        x: 'horse',
        y: 284,
      },
      {
        x: 'skateboard',
        y: 121,
      },
      {
        x: 'others',
        y: 9,
      },
    ],
  },
  {
    id: 'us',
    color: 'hsl(238, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 286,
      },
      {
        x: 'helicopter',
        y: 230,
      },
      {
        x: 'boat',
        y: 208,
      },
      {
        x: 'train',
        y: 41,
      },
      {
        x: 'subway',
        y: 137,
      },
      {
        x: 'bus',
        y: 101,
      },
      {
        x: 'car',
        y: 161,
      },
      {
        x: 'moto',
        y: 173,
      },
      {
        x: 'bicycle',
        y: 158,
      },
      {
        x: 'horse',
        y: 91,
      },
      {
        x: 'skateboard',
        y: 48,
      },
      {
        x: 'others',
        y: 226,
      },
    ],
  },
  {
    id: 'germany',
    color: 'hsl(268, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 176,
      },
      {
        x: 'helicopter',
        y: 121,
      },
      {
        x: 'boat',
        y: 127,
      },
      {
        x: 'train',
        y: 62,
      },
      {
        x: 'subway',
        y: 146,
      },
      {
        x: 'bus',
        y: 212,
      },
      {
        x: 'car',
        y: 176,
      },
      {
        x: 'moto',
        y: 117,
      },
      {
        x: 'bicycle',
        y: 183,
      },
      {
        x: 'horse',
        y: 114,
      },
      {
        x: 'skateboard',
        y: 286,
      },
      {
        x: 'others',
        y: 206,
      },
    ],
  },
  {
    id: 'norway',
    color: 'hsl(243, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 0,
      },
      {
        x: 'helicopter',
        y: 220,
      },
      {
        x: 'boat',
        y: 258,
      },
      {
        x: 'train',
        y: 257,
      },
      {
        x: 'subway',
        y: 203,
      },
      {
        x: 'bus',
        y: 255,
      },
      {
        x: 'car',
        y: 112,
      },
      {
        x: 'moto',
        y: 238,
      },
      {
        x: 'bicycle',
        y: 204,
      },
      {
        x: 'horse',
        y: 222,
      },
      {
        x: 'skateboard',
        y: 233,
      },
      {
        x: 'others',
        y: 247,
      },
    ],
  },
];
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
