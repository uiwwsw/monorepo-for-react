export interface StatsZoneData {
  displayName: string;
  zoneID: number;
  alarmNum: number;
  carrierNum: number;
  warningNum: number;
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
  no: number;
  carrierID: string;
  zoneID: number;
  setTime: string;
  clearTime: string;
  description: string;
}

export interface StatsCarrierData {
  no: number;
  carrierID: string;
  input: string;
  installedTime: string;
  output: string;
  completeTime: string;
}
