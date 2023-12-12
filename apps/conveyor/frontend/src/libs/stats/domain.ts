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

export class StatsSummaryData {
  rows: StatsSummaryDataRow[];
  constructor({ rows }: ZoneStatsResponse) {
    this.rows = rows.map((x) => new StatsSummaryDataRow(x));
  }
}
export class StatsSummaryDataRow {
  date: string;
  zoneId?: number;
  alarmNum?: number;
  carrierNum?: number;
  warningNum?: number;
  constructor({ date, zoneId, carrierNum, alarmNum, warningNum }: ZoneStatsItem) {
    this.date = date ? newDate(date).format(FORMAT_WITHOUT_TIME) : '';
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
  taskId?: number;
  location?: number;
  reason?: number;
  tcmId?: number;
  commandId?: string;
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
    CommandID,
    TCMID,
    CarrierID,
    SetTime,
    ClearTime,
  }: IAlarminfoRow) {
    this.no = No;
    this.serialNo = SerialNo;
    this.alarmCode = AlarmCode;
    this.taskId = TaskID;
    this.location = Location;
    this.reason = Reason;
    this.tcmId = TCMID;
    this.commandId = CommandID;
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
  commandId?: string;
  carrierId?: string;
  endTime: string;
  startTime: string;
  test?: Date;
  taskId?: number;
  zoneIdFrom?: number;
  zoneIdFromName?: string;
  zoneIdTo?: number;
  zoneIdToName?: string;
  constructor({
    TaskID,
    ZoneIDTo,
    CommandID,
    CarrierID,
    ZoneIDFrom,
    StartTime,
    EndTime,
    ZoneIDToName,
    ZoneIDFromName,
  }: CarrierStatsRow) {
    this.commandId = CommandID;
    this.carrierId = CarrierID;
    this.endTime = EndTime ? newDate(EndTime).format(FORMAT) : '';
    this.startTime = StartTime ? newDate(StartTime).format(FORMAT) : '';
    this.test = StartTime;
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
