import { TITAN_INTERNAL_EVENT_ID } from '!/alarm/domain';
import { EquipmentStateObject, ModuleState, TCMInfo, WarningInfo } from '@package-backend/types';
import { FORMAT_WITHOUT_TIME, newDate } from '@package-frontend/utils';
export const SERVERS = ['DCM', 'HIM'] as const;
export type SERVER_TYPE = (typeof SERVERS)[number];
export interface ProcessList {
  procList: { procId: number; procName: string }[];
}
export enum ALIVE {
  OFFLINE,
  CONNECTED,
}
export class CommunicationList {
  type: string;
  commState: string;
  controlState: string;
  processingState: string;
  constructor({ type, CommState, ControlState, ProcessingState }: EquipmentStateObject & { type: string }) {
    this.type = type;
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
  constructor({ StateType, ID, Alive }: ModuleState) {
    this.stateType = StateType as SERVER_TYPE;
    this.id = Number(ID);
    this.alive = Alive;
    this.status = ALIVE[Alive] as keyof typeof ALIVE;
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
    this.buildDate = newDate(BuildDate).format(FORMAT_WITHOUT_TIME);
    this.status = ALIVE[alive] as keyof typeof ALIVE;
  }
}

export class Alarm {
  eventCode: TITAN_INTERNAL_EVENT_ID;
  carrierId: string;
  commandId: string;
  location?: unknown;
  reason: string;
  serialNo: number;
  taskId: string;
  time: string;
  constructor({ SerialNo, EventCode, TaskID, Location, Reason, CommandID, CarrierID, Time }: WarningInfo) {
    this.eventCode = EventCode as TITAN_INTERNAL_EVENT_ID;
    this.carrierId = CarrierID;
    this.commandId = CommandID;
    this.location = Location;
    this.reason = Reason;
    this.serialNo = SerialNo;
    this.taskId = TaskID;
    this.time = Time;
  }
}
