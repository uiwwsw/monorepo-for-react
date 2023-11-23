export enum UploadStatus {
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

export enum ReponseStatus {
  SUCCESS = 'sucess',
  FAIL = 'fail',
}

export interface fileInfo {
  fileName: string;
  fileSize: number; //byte
  //add file info
}

export interface firmwareStatus {
  status: UploadStatus;
}

export interface deviceStatus {
  tid: number;
  status: Status;
}

export interface clientStatus {
  tid: number;
  cstatus: ConnectionStatus;
}

export interface responseStatus {
  result: ReponseStatus;
  reason?: string;
}

export interface serverInfo {
  sid: number;
  name: string;
  status: Status;
  version: string;
}

export interface tcmInfo {
  tid: number;
  status: Status;
  version: string;
  AdjTCMConnection: string;
  AdjTCMConnectionDetail: clientStatus[];
  Process: string[];
}

export interface uploadFile {
  name: string;
  size: number;
  type: string;
}
