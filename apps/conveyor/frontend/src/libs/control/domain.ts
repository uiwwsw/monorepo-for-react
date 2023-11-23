export enum UpdateStatus {
  Idle = 'idle',
  Updating = 'updating',
  Completed = 'completed',
  Error = 'error',
}

export enum Status {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum ConnectionStatus {
  ON = 'on',
  OFF = 'off',
}

export interface firmwareStatus {
  status: UpdateStatus;
}

export interface deviceStatus {
  tid: number;
  status: Status;
}

export interface ClientStatus {
  tid: number;
  cstatus: ConnectionStatus;
}

export interface ServerInfo {
  sid: number;
  name: string;
  status: Status;
  version: string;
}

export interface TCMInfo {
  tid: number;
  status: Status;
  version: string;
  AdjTCMConnection: ClientStatus[] | string;
  Process: string[];
}

export interface UploadFile {
  name: string;
  size: number;
  type: string;
}
