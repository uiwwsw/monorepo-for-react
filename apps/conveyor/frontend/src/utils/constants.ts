import { t } from 'src/i18n';
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
export const columnAlarmDisabled = mustHaveColumnAlarm.reduce((a, v) => ({ ...a, [v]: true }), {});
export type TheadCarrier = (typeof theadCarrier)[number];
export const fixHeadAlarm: Record<TheadAlarm, string> = {
  no: t('번호'),
  serialNo: t('시리얼번호'),
  alarmCode: t('알람코드'),
  alarmDescription: t('알람설명'),
  taskId: t('작업 아이디'),
  location: t('위치'),
  reason: t('이유'),
  tcmId: t('TCM 아이디'),
  carrierId: t('캐리어 아이디'),
  setTime: t('설정 시간'),
  clearTime: t('해제 시간'),
};
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
export const columnCarrierDisabled = mustHaveColumnCarrier.reduce((a, v) => ({ ...a, [v]: true }), {});

export const fixHeadCarrier: Record<TheadCarrier, string> = {
  carrierId: t('캐리어 아이디'),
  endTime: t('종료 시간'),
  startTime: t('시작 시간'),
  taskId: t('작업 아이디'),
  zoneIdFrom: t('출발 지역 아이디'),
  zoneIdFromName: t('출발 지역 이름'),
  zoneIdTo: t('도착 지역 아이디'),
  zoneIdToName: t('도착 지역 이름'),
};

export type TheadSummary = (typeof theadSummary)[number];

export const theadSummary = [
  'level',
  'zoneId',
  'displayName',
  'physicalType',
  'date',
  'alarmNum',
  'carrierNum',
  'warningNum',
] as const;
export const mustHaveColumnSummary: (TheadSummary | 'select')[] = ['select'];
export const columnSummaryDisabled = mustHaveColumnSummary.reduce((a, v) => ({ ...a, [v]: true }), {});

export const fixHeadSummary: Record<TheadSummary, string> = {
  level: t('레벨'),
  zoneId: t('지역 아이디'),
  displayName: t('표시 이름'),
  physicalType: t('물리적 유형'),
  date: t('날짜'),
  alarmNum: t('알람 번호'),
  carrierNum: t('캐리어 번호'),
  warningNum: t('경고 번호'),
};
