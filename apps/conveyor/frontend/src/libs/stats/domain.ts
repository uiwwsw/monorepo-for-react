export interface StatsSummaryData {
  date: string;
  zoneId: number;
  alarmNum: number;
  carrierNum: number;
  warningNum: number;
}

export interface StatsAlarmDataRow {
  no: number;
  serialNo: number;
  alarmCode: number;
  taskId: number;
  location: number;
  reason: number;
  tcmId: number;
  commandId: string;
  carrierId: string;
  setTime: string;
  clearTime: string;
}

export interface StatsAlarmData {
  rows: StatsAlarmDataRow[];
  total_count: number;
}

export interface StatsCarrierDataRow {
  carrierID: string;
  endTime?: string;
  startTime: string;
  taskID: number;
  zoneIDFrom: number;
  zoneIDFromName: string;
  zoneIDTo: number;
  zoneIDToName: string;
}

export interface StatsCarrierData {
  rows: StatsCarrierDataRow[];
  total_count: number;
}
export interface ZoneList {
  No: number;
  ZoneID: number;
  DisplayName: string;
  PhysicalType: number;
}
