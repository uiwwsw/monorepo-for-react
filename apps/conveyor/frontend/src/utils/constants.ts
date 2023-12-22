export type TheadAlarm = (typeof theadAlarm)[number];
export const theadAlarm = [
  'no',
  'serialNo',
  'alarmCode',
  'alarmDescription',
  'taskId',
  'location',
  'reason',
  'tcmId',
  'carrierId',
  'setTime',
  'clearTime',
] as const;
export const mustHaveColumnAlarm: TheadAlarm[] = ['no'];
export type TheadCarrier = (typeof theadCarrier)[number];

export const theadCarrier = [
  'carrierId',
  'endTime',
  'startTime',
  'taskId',
  'zoneIdFrom',
  'zoneIdFromName',
  'zoneIdTo',
  'zoneIdToName',
] as const;
export const mustHaveColumnCarrier: TheadCarrier[] = ['carrierId'];
