// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsSummaryData } from '../domain';

export interface SearchZoneArg {
  begin_date: string;
  end_date: string;
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
  const zones: StatsSummaryData[] = [
    { date: '2023-11-22', zoneId: 10101, alarmNum: 0, carrierNum: 10, warningNum: 1 },
    { date: '2023-11-22', zoneId: 10102, alarmNum: 1, carrierNum: 0, warningNum: 3 },
    { date: '2023-11-22', zoneId: 10103, alarmNum: 0, carrierNum: 31, warningNum: 0 },
    { date: '2023-11-22', zoneId: 10104, alarmNum: 0, carrierNum: 22, warningNum: 0 },
    { date: '2023-11-22', zoneId: 10106, alarmNum: 0, carrierNum: 0, warningNum: 3 },
    { date: '2023-11-22', zoneId: 10107, alarmNum: 0, carrierNum: 0, warningNum: 2 },
    { date: '2023-11-22', zoneId: 10201, alarmNum: 0, carrierNum: 6, warningNum: 0 },
    { date: '2023-11-22', zoneId: 10202, alarmNum: 2, carrierNum: 0, warningNum: 0 },
    { date: '2023-11-22', zoneId: 10203, alarmNum: 1, carrierNum: 0, warningNum: 1 },
    { date: '2023-11-22', zoneId: 10204, alarmNum: 2, carrierNum: 7, warningNum: 0 },
    { date: '2023-11-22', zoneId: 10205, alarmNum: 3, carrierNum: 5, warningNum: 0 },
    { date: '2023-11-22', zoneId: 10206, alarmNum: 1, carrierNum: 0, warningNum: 1 },
    { date: '2023-11-22', zoneId: 10207, alarmNum: 2, carrierNum: 7, warningNum: 0 },
    { date: '2023-11-22', zoneId: 10208, alarmNum: 3, carrierNum: 5, warningNum: 0 },
    { date: '2023-11-23', zoneId: 10101, alarmNum: 0, carrierNum: 21, warningNum: 0 },
    { date: '2023-11-23', zoneId: 10102, alarmNum: 0, carrierNum: 0, warningNum: 0 },
    { date: '2023-11-23', zoneId: 10103, alarmNum: 1, carrierNum: 35, warningNum: 5 },
    { date: '2023-11-23', zoneId: 10104, alarmNum: 0, carrierNum: 23, warningNum: 3 },
    { date: '2023-11-23', zoneId: 10107, alarmNum: 0, carrierNum: 0, warningNum: 2 },
    { date: '2023-11-23', zoneId: 10201, alarmNum: 0, carrierNum: 12, warningNum: 0 },
    { date: '2023-11-23', zoneId: 10203, alarmNum: 3, carrierNum: 0, warningNum: 0 },
    { date: '2023-11-23', zoneId: 10204, alarmNum: 1, carrierNum: 3, warningNum: 0 },
    { date: '2023-11-23', zoneId: 10205, alarmNum: 0, carrierNum: 10, warningNum: 1 },
    { date: '2023-11-23', zoneId: 10206, alarmNum: 0, carrierNum: 0, warningNum: 1 },
    { date: '2023-11-23', zoneId: 10207, alarmNum: 0, carrierNum: 9, warningNum: 0 },
    { date: '2023-11-23', zoneId: 10208, alarmNum: 0, carrierNum: 3, warningNum: 0 },
  ];
  return fakeApi(zones);
  //   return await http({ url });
}

export function useGetZoneInfo({ arg }: { arg: SearchZoneArg }) {
  return useSWR('/get-zoneInfo', (url) => fetcher(url, { arg }));
}
