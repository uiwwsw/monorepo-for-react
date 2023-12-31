import { ALARM_CODE } from '!/alarm/domain';
import { EquipmentStateObject, ModuleState, TCMInfo, WarningInfo } from '@package-backend/types';
import { FORMAT_WITHOUT_TIME, newDate } from '@package-frontend/utils';
export const SERVERS = ['DCM', 'HIM'] as const;
export type SERVER_TYPE = (typeof SERVERS)[number];
export enum ALIVE {
  OFFLINE,
  CONNECTED,
}
export const COMMUNICATION_KEYS = ['MCS1', 'MCS2'] as const;
export type COMMUNICATION_TYPE = (typeof COMMUNICATION_KEYS)[number];
export type AdapterModuleState = ModuleState & {
  BuildNum?: string;
  BuildDate?: string;
};
export class CommunicationList {
  type: COMMUNICATION_TYPE;
  commState: string;
  controlState: string;
  processingState: string;
  constructor({ type, CommState, ControlState, ProcessingState }: EquipmentStateObject & { type: string }) {
    this.type = type as COMMUNICATION_TYPE;
    this.commState = CommState;
    this.controlState = ControlState;
    this.processingState = ProcessingState;
  }
}
export class ServerList {
  status: keyof typeof ALIVE;
  stateType: SERVER_TYPE;
  id?: number;
  alive: number;
  buildNum: string;
  buildDate: string;
  constructor({ StateType, ID, Alive, BuildDate, BuildNum }: AdapterModuleState) {
    this.stateType = StateType as SERVER_TYPE;
    this.id = Number(ID);
    this.alive = Alive;
    this.status = ALIVE[Alive] as keyof typeof ALIVE;
    this.buildNum = BuildNum ?? '';
    this.buildDate = BuildDate ? newDate(BuildDate).format(FORMAT_WITHOUT_TIME) : '';
  }
}
export class TcmList {
  alive: number;
  status: keyof typeof ALIVE;
  tcmId: number;
  buildDate: string;
  buildNum: string;
  ipAddress: string;
  constructor({ IPAddress, TCMID, BuildNum, BuildDate, alive }: TCMInfo & { alive: number }) {
    this.alive = alive;
    this.tcmId = Number(TCMID);
    this.ipAddress = IPAddress;
    this.buildNum = BuildNum;
    this.buildDate = BuildDate ? newDate(BuildDate).format(FORMAT_WITHOUT_TIME) : '';
    this.status = ALIVE[alive] as keyof typeof ALIVE;
  }
}

export class Alarm {
  eventCode: ALARM_CODE;
  carrierId: string;
  commandId: string;
  location?: unknown;
  reason: unknown;
  serialNo: number;
  taskId: string;
  time: string;
  constructor({ SerialNo, EventCode, TaskID, Location, Reason, CommandID, CarrierID, Time }: WarningInfo) {
    this.eventCode = EventCode as ALARM_CODE;
    this.carrierId = CarrierID;
    this.commandId = CommandID;
    this.location = Location;
    this.reason = Reason;
    this.serialNo = SerialNo;
    this.taskId = TaskID;
    this.time = Time;
  }
}

// export class Warning {
//   eventCode: ALARM_CODE;
//   carrierId: string;
//   commandId: string;
//   location?: unknown;
//   reason: unknown;
//   serialNo: number;
//   taskId: string;
//   time: string;
//   constructor({ SerialNo, EventCode, TaskID, Location, Reason, CommandID, CarrierID, Time }: WarningInfo) {
//     this.eventCode = EventCode as ALARM_CODE;
//     this.carrierId = CarrierID;
//     this.commandId = CommandID;
//     this.location = Location;
//     this.reason = Reason;
//     this.serialNo = SerialNo;
//     this.taskId = TaskID;
//     this.time = Time;
//   }
// }
