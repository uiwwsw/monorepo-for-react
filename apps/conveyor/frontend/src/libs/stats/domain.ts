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
  sortValue?: number;
  character?: string;
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
  carrierID: string;
  zoneID: number;
  setTime: string;
  clearTime: string;
  description: string;
}

export interface StatsCarrierData {
  carrierID: string;
  input: string;
  installedTime: string;
  output: string;
  completeTime: string;
}

export enum SortValue {
  zoneID = 0,
  alarmNum,
  carrierNum,
}

export enum KeywordFunction {
  ZONE = 0,
  ALARM,
  CARRIER,
}

export interface searchWithKeywordProps {
  keyword: string;
  currentRenderList: [];
  setRenderList: ([]) => void;
  startTime: string;
  endTime: string;
  functionValue: KeywordFunction;
}
