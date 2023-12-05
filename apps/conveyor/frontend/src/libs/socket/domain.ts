export type SOCKET_NAME = 'ZONE_GET_INFO';
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
