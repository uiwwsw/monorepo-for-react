export interface StatsSummaryData {
  date: string;
  zoneId: number;
  alarmNum: number;
  carrierNum: number;
  warningNum: number;
}

export interface StatsAlarmDataRow {
  No: number;
  SerialNo: number;
  AlarmCode: number;
  TaskID: number;
  Location: number;
  Reason: number;
  TCMID: number;
  CommandID: string;
  CarrierID: string;
  SetTime: string;
  ClearTime: string;
}

export interface StatsAlarmData {
  rows: StatsAlarmDataRow[];
  total_count: number;
}

export interface StatsCarrierDataRow {
  TaskID: number;
  CommandID: string;
  CarrierID: string;
  ZoneIDFrom: number;
  StartTime: string;
  ZoneIDTo: number;
  EndTime: string;
  ZoneIDToName: string;
  ZoneIDFromName: string;
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
