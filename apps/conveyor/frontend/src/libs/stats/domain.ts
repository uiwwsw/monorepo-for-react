export interface StatsZoneDataRow {
  zoneId: number;
  alarmNum: number;
  carrierNum: number;
  warningNum: number;
}

export interface StatsZoneData {
  rows: StatsZoneDataRow[];
  total_count: number;
}

export interface GraphDataDetail {
  transfer: number;
  alarm: number;
  date: string;
}

export interface StatsGraphData {
  port: string;
  data: GraphDataDetail[];
}

export interface StatsAlarmData {
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

export interface StatsCarrierData {
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
export interface ZoneList {
  No: number;
  ZoneID: number;
  DisplayName: string;
  PhysicalType: number;
}
