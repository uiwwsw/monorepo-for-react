export interface StatsZoneData {
  displayName: string;
  zoneID: number;
  alarmNum: number;
  carrierNum: number;
  warningNum: number;
}

export interface SearchArg {
  startTime: string;
  endTime: string;
  character?: string;
}
export interface SearchZoneArg {
  startTime: string;
  endTime: string;
  pageNum: number; // 전체 데이터를 count갯수만큼이 1page라고 했을때 원하는 page
  pagePerCount: number; // 한번에 가져올 데이터 갯수
  character?: string;
  sortValue?: number;
  zoneID?: number;
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
