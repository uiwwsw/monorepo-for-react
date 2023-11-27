export type UPLOAD_STATUS = 'IDLE' | 'UPDATING' | 'COMPLETE' | 'ERROR';

export type STATUS = 'ONLINE' | 'OFFLINE';

export type CONNECTION_STATUS = 'ON' | 'OFF';

export type SERVER_TYPE = 'HIM' | 'DCM' | 'HIM';

export const enum RESPONSE_RESULT {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  //add more status..
}

export interface FileInfo {
  fileName: string;
  fileSize: number; //byte
  //add file info
}

export interface FirmwareStatus {
  status: UPLOAD_STATUS;
}

export interface ClientStatus {
  tid: number;
  connectionStatus: CONNECTION_STATUS;
}

export interface ResponseStatus {
  result: RESPONSE_RESULT;
  reason?: string;
}

export interface ServerInfo {
  sid: number;
  type: SERVER_TYPE;
  status: STATUS;
  version: string;
}

export interface TcmInfo {
  tid: number;
  status: STATUS;
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
