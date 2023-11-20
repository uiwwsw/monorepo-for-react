// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsZoneData } from '../domain';

export interface SearchZoneArg {
  startTime: string;
  endTime: string;
  pageNum: number; // 전체 데이터를 count갯수만큼이 1page라고 했을때 원하는 page
  pagePerCount: number; // 한번에 가져올 데이터 갯수
  character?: string;
  sortValue?: number;
  zoneID?: number;
}
const logger = createLogger('stats/useGetZoneInfo');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: SearchZoneArg;
  },
) {
  logger(url, arg);
  const zones: StatsZoneData[] = [
    { zoneID: 10101, displayName: '10101', alarmNum: 0, carrierNum: 10, warningNum: 1 },
    { zoneID: 10102, displayName: '10102', alarmNum: 1, carrierNum: 0, warningNum: 3 },
    { zoneID: 10103, displayName: '10103', alarmNum: 0, carrierNum: 31, warningNum: 0 },
    { zoneID: 10104, displayName: '10104', alarmNum: 0, carrierNum: 22, warningNum: 0 },
    { zoneID: 10105, displayName: '10105', alarmNum: 3, carrierNum: 0, warningNum: 0 },
    { zoneID: 10106, displayName: '10106', alarmNum: 0, carrierNum: 0, warningNum: 3 },
    { zoneID: 10107, displayName: '10107', alarmNum: 0, carrierNum: 0, warningNum: 2 },
    { zoneID: 10201, displayName: '10201', alarmNum: 0, carrierNum: 6, warningNum: 0 },
    { zoneID: 10202, displayName: '10202', alarmNum: 2, carrierNum: 0, warningNum: 0 },
  ];
  const zones1: StatsZoneData[] = [
    { zoneID: 102032, displayName: '102032', alarmNum: 1, carrierNum: 0, warningNum: 1 },
    { zoneID: 102033, displayName: '102033', alarmNum: 2, carrierNum: 7, warningNum: 0 },
    { zoneID: 102034, displayName: '102034', alarmNum: 3, carrierNum: 5, warningNum: 0 },
  ];
  const zones2: StatsZoneData[] = [
    { zoneID: 102035, displayName: '102035', alarmNum: 1, carrierNum: 0, warningNum: 1 },
    { zoneID: 102036, displayName: '102036', alarmNum: 2, carrierNum: 7, warningNum: 0 },
    { zoneID: 102037, displayName: '102037', alarmNum: 3, carrierNum: 5, warningNum: 0 },
  ];
  if (arg.pageNum === 0) {
    return fakeApi(zones);
  } else if (arg.pageNum === 1) {
    return fakeApi(zones1);
  } else if (arg.pageNum === 2) {
    return fakeApi(zones2);
  } else return fakeApi(null);
  //   return await http({ url });
}

export function useGetZoneInfo({ arg }: { arg: SearchZoneArg }) {
  return useSWR('/get-zoneInfo', (url) => fetcher(url, { arg }));
}
