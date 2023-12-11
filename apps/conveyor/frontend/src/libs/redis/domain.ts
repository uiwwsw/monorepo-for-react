export interface EquipmentValue {
  model: string;
  name: string;
  defaultModel: string;
  transferTimeout: number;
}
export interface MotionParameters {
  maintVel: number;
  maintAcc: number;
  maintDcc: number;
  maintJerk: number;
  runFastVel: number;
  runFastAcc: number;
  runFastDcc: number;
  runFastJerk: number;
  runSlowVel: number;
  runSlowAcc: number;
  runSlowDcc: number;
  runSlowJerk: number;
  overrideVel: number;
  overrideAcc: number;
  overrideDcc: number;
  overrideJerk: number;
}
export interface MotionParameter {
  overrideDelay: string;
  dccRatio: string;
  runCurrent: string;
  standbyCurrent: string;
}
export interface OffsetInfo {
  included: 0;
  east: unknown;
  eastOut: unknown;
  west: unknown;
  westOut: unknown;
  north: unknown;
  south: unknown;
  southOut: unknown;
  homeOffset: unknown;
  homeDirection: unknown;
  negativeOffset: unknown;
  positiveOffset: unknown;
  isWayPoint: unknown;
}
export interface TcmClient {
  state: {
    tcm_id: number;
    alive: number;
  }[];
  write_log: number;
}
export interface ZoneInfo {
  zones: {
    id: 0;
    name: string;
    type: string;
    status: string;
  }[];
}
