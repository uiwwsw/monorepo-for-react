export const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' bytes';
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
};

export enum UPLOAD_STATUS {
  IDLE,
  UPDATING,
  COMPLETED,
  ERROR,
}

export const enum CONTROL_STATUS {
  ONLINE,
  OFFLINE,
}

export const enum TCM_CONNECTION_STATUS {
  ON,
  OFF,
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
  cStatus: TCM_CONNECTION_STATUS;
}

export interface ServerInfo {
  sid: number;
  type: string;
  status: CONTROL_STATUS;
  version: string;
}

export interface TcmInfo {
  tid: number;
  status: CONTROL_STATUS;
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

export type CTRL_SOCKET_NAME = 'ZONE_GET_INFO';
