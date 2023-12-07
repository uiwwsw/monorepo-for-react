// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsSummaryData } from '../domain';
import { http } from '#/ondhttp';

export interface Arg {
  start_time: string;
  end_time: string;
}
const logger = createLogger('stats/useZoneStats');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: Arg;
  },
) {
  logger(url, arg);
  // const zones: StatsSummaryData[] = [
  //   { date: '2023-11-22', zoneId: 10101, alarmNum: 0, carrierNum: 10, warningNum: 1 },
  //   { date: '2023-11-22', zoneId: 10102, alarmNum: 1, carrierNum: 0, warningNum: 3 },
  //   { date: '2023-11-22', zoneId: 10103, alarmNum: 0, carrierNum: 31, warningNum: 0 },
  //   { date: '2023-11-22', zoneId: 10104, alarmNum: 0, carrierNum: 22, warningNum: 0 },
  //   { date: '2023-11-22', zoneId: 10106, alarmNum: 0, carrierNum: 0, warningNum: 3 },
  //   { date: '2023-11-22', zoneId: 10107, alarmNum: 0, carrierNum: 0, warningNum: 2 },
  //   { date: '2023-11-22', zoneId: 10201, alarmNum: 0, carrierNum: 6, warningNum: 0 },
  //   { date: '2023-11-22', zoneId: 10202, alarmNum: 2, carrierNum: 0, warningNum: 0 },
  //   { date: '2023-11-22', zoneId: 10203, alarmNum: 1, carrierNum: 0, warningNum: 1 },
  //   { date: '2023-11-22', zoneId: 10204, alarmNum: 2, carrierNum: 7, warningNum: 0 },
  //   { date: '2023-11-22', zoneId: 10205, alarmNum: 3, carrierNum: 5, warningNum: 0 },
  //   { date: '2023-11-22', zoneId: 10206, alarmNum: 1, carrierNum: 0, warningNum: 1 },
  //   { date: '2023-11-22', zoneId: 10207, alarmNum: 2, carrierNum: 7, warningNum: 0 },
  //   { date: '2023-11-22', zoneId: 10208, alarmNum: 3, carrierNum: 5, warningNum: 0 },
  //   { date: '2023-11-23', zoneId: 10101, alarmNum: 0, carrierNum: 21, warningNum: 0 },
  //   { date: '2023-11-23', zoneId: 10102, alarmNum: 0, carrierNum: 0, warningNum: 0 },
  //   { date: '2023-11-23', zoneId: 10103, alarmNum: 1, carrierNum: 35, warningNum: 5 },
  //   { date: '2023-11-23', zoneId: 10104, alarmNum: 0, carrierNum: 23, warningNum: 3 },
  //   { date: '2023-11-23', zoneId: 10107, alarmNum: 0, carrierNum: 0, warningNum: 2 },
  //   { date: '2023-11-23', zoneId: 10201, alarmNum: 0, carrierNum: 12, warningNum: 0 },
  //   { date: '2023-11-23', zoneId: 10203, alarmNum: 3, carrierNum: 0, warningNum: 0 },
  //   { date: '2023-11-23', zoneId: 10204, alarmNum: 1, carrierNum: 3, warningNum: 0 },
  //   { date: '2023-11-23', zoneId: 10205, alarmNum: 0, carrierNum: 10, warningNum: 1 },
  //   { date: '2023-11-23', zoneId: 10206, alarmNum: 0, carrierNum: 0, warningNum: 1 },
  //   { date: '2023-11-23', zoneId: 10207, alarmNum: 0, carrierNum: 9, warningNum: 0 },
  //   { date: '2023-11-23', zoneId: 10208, alarmNum: 0, carrierNum: 3, warningNum: 0 },
  // ];
  const res = await http<StatsSummaryData, Arg>({
    url,
    method: 'POST',
    arg,
  });
  logger(res);

  return res;
}

export function useZoneStats(arg: Arg) {
  return useSWR('/api/stats/zone-stats', (url) => fetcher(url, { arg }));
}
