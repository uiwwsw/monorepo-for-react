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

export enum ResponseResult {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export interface FileInfo {
  fileName: string;
  fileSize: number; //byte
  //add file info
}

export interface FirmwareStatus {
  status: UploadStatus;
}

export interface ClientStatus {
  tid: number;
  cstatus: ConnectionStatus;
}

export interface ResponseStatus {
  result: ResponseResult;
  reason?: string;
}

export interface ServerInfo {
  sid: number;
  type: string;
  status: Status;
  version: string;
}

export interface TcmInfo {
  tid: number;
  status: Status;
  version: string;
  adjTcmConnection: string;
  adjTcmConnectionDetail: ClientStatus[];
  Process: string[];
}

export interface UploadFile {
  name: string;
  size: number;
  type: string;
}

export type CTRL_SOCKET_NAME = 'tcmUpdate' | 'serverUpdate';
