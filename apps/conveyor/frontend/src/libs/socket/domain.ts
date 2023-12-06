export interface SocketData<T> {
  type: SOCKET_MESSAGE;
  data: T;
}
export interface TcmInfo {
  buildDate: number;
  buildNum: number;
  ipAddress: string;
  tcmId: number;
}
export interface ModuleState {
  alive: number;
  id?: number;
  stateType: 'DCM' | 'TCM' | 'HIM';
}
export interface HimState {
  mcs1: HimStateInfo;
  mcs2: HimStateInfo;
}
export interface HimStateInfo {
  commState?: number;
  controlState: number;
  processingState: number;
}
export interface Alarm<T = string> {
  alarmCode?: T;
  carrierID: string;
  commandID: string;
  location?: unknown;
  reason: string;
  serialNo: number;
  taskID: string;
  time: number;
}
export const enum SOCKET_NAME {
  ZONE_GET_INFO = 'ZONE_GET_INFO',
  MODULE_START_HIM = 'MODULE_START_HIM',
  MODULE_STOP_HIM = 'MODULE_STOP_HIM',
  MODULE_START_DCM = 'MODULE_START_DCM',
  MODULE_STOP_DCM = 'MODULE_STOP_DCM',
  MODULE_START_TCM = 'MODULE_START_TCM',
  MODULE_STOP_TCM = 'MODULE_STOP_TCM',

  MODULE_RESTART_HIM = 'MODULE_RESTART_HIM',
  MODULE_RESTART_DCM = 'MODULE_RESTART_DCM',
  MODULE_RESTART_TCM = 'MODULE_RESTART_TCM',
}

export const enum SOCKET_MESSAGE {
  INITIALIZE_DATA_SEND = 'initializedataSend',
  UPDATE_CARRIER_INFO = 'UpdateCarrierInfo',
  TCM_TRANSFER_INFO = 'tcmTransferInfo',
  TCM_EVENT_SET = 'tcsEventSet',
  TCM_WARNING_SET = 'tcsWarningSet',
  TCM_UPDATE_ZONE_STATE = 'UpdateZoneState',
  TCM_UPDATE_ZONE_OCCUPIED_STATE = 'UpdateZoneOccupiedState',
  TCM_ALARM_SET = 'tcmAlarmSet',
  TCS_ALARM_CLEAR = 'tcsAlarmClear',
  INITIAL_MODULE_STATE = 'initialmodulestate',
  RESET_DATA = 'resetdata',
  HIM_EQUIPMENT_STATE_INFO = 'himEquipmentStateInfo',
  TCM_INFO = 'TCMInfo',
  GUI_RENDER_INFO = 'guiRenderInfo',
  RESOURCE_INFO = 'resouceInfo',
}
