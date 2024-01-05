import { TITAN_INTERNAL_EVENT_ID, convertAlarmToMessage } from '!/alarm/domain';
import {
  AlarmStatsResponse,
  CarrierStatsResponse,
  CarrierStatsRow,
  IAlarminfoRow,
  Zone,
  ZoneListResponse,
  ZoneStatsItem,
  ZoneStatsResponse,
} from '@package-backend/types';
import { FORMAT, FORMAT_WITHOUT_TIME, newDate } from '@package-frontend/utils';
import { t } from 'src/i18n';

export class StatsSummaryData {
  rows: StatsSummaryDataRow[];
  constructor({ rows }: ZoneStatsResponse) {
    this.rows = rows.map((x) => new StatsSummaryDataRow(x));
  }
}
export class StatsSummaryDataRow {
  date: string;
  dateFormat: string;
  zoneId?: number;
  alarmNum?: number;
  carrierNum?: number;
  warningNum?: number;
  constructor({ date, zoneId, carrierNum, alarmNum, warningNum }: ZoneStatsItem) {
    this.date = date ? newDate(date).toISOString() : '';
    this.dateFormat = date ? newDate(date).format(FORMAT_WITHOUT_TIME) : '';
    this.zoneId = zoneId;
    this.alarmNum = alarmNum;
    this.carrierNum = carrierNum;
    this.warningNum = warningNum;
  }
}

export class StatsAlarmDataRow {
  no?: number;
  serialNo?: number;
  alarmCode?: number;
  alarmDescription?: string;
  taskId?: number;
  location?: number;
  reason?: number;
  tcmId?: number;
  // commandId?: string;
  carrierId?: string;
  setTime: string;
  clearTime: string;
  constructor({
    No,
    SerialNo,
    AlarmCode,
    TaskID,
    Location,
    Reason,
    // CommandID,
    TCMID,
    CarrierID,
    SetTime,
    ClearTime,
  }: IAlarminfoRow) {
    this.no = No;
    this.serialNo = SerialNo;
    this.alarmCode = AlarmCode;
    this.alarmDescription = convertAlarmToMessage({
      eventCode: `${AlarmCode}` as TITAN_INTERNAL_EVENT_ID,
      carrierId: CarrierID,
      reason: `${Reason}`,
      location: Location,
    });
    this.taskId = TaskID;
    this.location = Location;
    this.reason = Reason;
    this.tcmId = TCMID;
    // this.commandId = CommandID;
    this.carrierId = CarrierID;
    this.setTime = SetTime ? newDate(SetTime).format(FORMAT) : '';
    this.clearTime = ClearTime ? newDate(ClearTime).format(FORMAT) : '';
  }
}

export class StatsAlarmData {
  rows: StatsAlarmDataRow[];
  totalCount: number;
  constructor({ rows, total_count }: AlarmStatsResponse) {
    this.rows = rows.map((x) => new StatsAlarmDataRow(x));
    this.totalCount = total_count;
  }
}

export class StatsCarrierDataRow {
  // commandId?: string;
  carrierId?: string;
  endTime: string;
  startTime: string;
  taskId?: number;
  zoneIdFrom?: number;
  zoneIdFromName?: string;
  zoneIdTo?: number;
  zoneIdToName?: string;
  constructor({
    TaskID,
    ZoneIDTo,
    // CommandID,
    CarrierID,
    ZoneIDFrom,
    StartTime,
    EndTime,
    ZoneIDToName,
    ZoneIDFromName,
  }: CarrierStatsRow) {
    // this.commandId = CommandID;
    this.carrierId = CarrierID;
    this.endTime = EndTime ? newDate(EndTime).format(FORMAT) : '';
    this.startTime = StartTime ? newDate(StartTime).format(FORMAT) : '';
    this.taskId = TaskID;
    this.zoneIdFrom = ZoneIDFrom;
    this.zoneIdFromName = ZoneIDFromName;
    this.zoneIdTo = ZoneIDTo;
    this.zoneIdToName = ZoneIDToName;
  }
}

export class StatsCarrierData {
  rows: StatsCarrierDataRow[];
  totalCount: number;
  constructor({ rows, total_count }: CarrierStatsResponse) {
    this.rows = rows.map((x) => new StatsCarrierDataRow(x));
    this.totalCount = total_count;
  }
}
export class ZoneList {
  zones: ZoneListZone[];
  constructor({ zones }: ZoneListResponse) {
    this.zones = zones.map((x) => new ZoneListZone(x));
  }
}
export class ZoneListZone {
  level: number;
  zoneId: number;
  displayName?: string;
  physicalType?: number;
  constructor({ Level, ZoneID, DisplayName, PhysicalType }: Zone) {
    this.level = Level;
    this.zoneId = ZoneID;
    this.displayName = DisplayName;
    this.physicalType = PhysicalType;
  }
}
export type TheadAlarm = keyof StatsAlarmDataRow;
export const theadAlarm: TheadAlarm[] = [
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
];
export const mustHaveColumnAlarm: TheadAlarm[] = ['no'];
export const columnAlarmDisabled = mustHaveColumnAlarm.reduce(
  (a, v) => ({ ...a, [v]: true }),
  {} as Partial<Record<TheadAlarm, boolean>>,
);
export type TheadCarrier = keyof StatsCarrierDataRow;
export const fixHeadAlarm: Partial<Record<TheadAlarm, string>> = {
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
export const theadCarrier: TheadCarrier[] = [
  'carrierId',
  'endTime',
  'startTime',
  'taskId',
  'zoneIdFrom',
  'zoneIdFromName',
  'zoneIdTo',
  'zoneIdToName',
];
export const mustHaveColumnCarrier: TheadCarrier[] = ['carrierId'];
export const columnCarrierDisabled = mustHaveColumnCarrier.reduce(
  (a, v) => ({ ...a, [v]: true }),
  {} as Partial<Record<TheadCarrier, boolean>>,
);

export const fixHeadCarrier: Partial<Record<TheadCarrier, string>> = {
  carrierId: t('캐리어 아이디'),
  endTime: t('종료 시간'),
  startTime: t('시작 시간'),
  taskId: t('작업 아이디'),
  zoneIdFrom: t('출발 존 아이디'),
  zoneIdFromName: t('출발 존 이름'),
  zoneIdTo: t('도착 존 아이디'),
  zoneIdToName: t('도착 존 이름'),
};

export type TheadSummary = keyof StatsSummaryDataRow | keyof ZoneListZone;

export const theadSummary: TheadSummary[] = [
  'level',
  'zoneId',
  'displayName',
  'physicalType',
  'dateFormat',
  'alarmNum',
  'carrierNum',
  'warningNum',
];
export const mustHaveColumnSummary: (TheadSummary | 'select')[] = ['select', 'level'];
export const columnSummaryDisabled = mustHaveColumnSummary.reduce(
  (a, v) => ({ ...a, [v]: true }),
  {} as Partial<Record<TheadSummary, boolean>>,
);

export const fixHeadSummary: Partial<Record<TheadSummary, string>> = {
  level: t('레벨'),
  zoneId: t('존 아이디'),
  displayName: t('표시 이름'),
  physicalType: t('물리적 유형'),
  dateFormat: t('날짜'),
  alarmNum: t('알람 번호'),
  carrierNum: t('캐리어 번호'),
  warningNum: t('경고 번호'),
};
