// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsSummaryData } from '../domain';
import { http, toJson } from '#/http';
import { ZoneStatsResponse } from '@package-backend/types';

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
  const res = await http<Arg>({
    url,
    method: 'POST',
    arg,
  });
  logger(url, arg, res);
  const json = await toJson<ZoneStatsResponse>(res);
  // const json = [
  //   {
  //     date: newDate('2023-12-28').toISOString(),
  //     zoneId: 31311,
  //     carrierNum: 4,
  //     alarmNum: 1,
  //     warningNum: 2,
  //   },
  //   {
  //     date: newDate('2024-01-03').toISOString(),
  //     zoneId: 31311,
  //     carrierNum: 3,
  //     alarmNum: 1,
  //     warningNum: 2,
  //   },
  //   {
  //     date: newDate().toISOString(),
  //     zoneId: 21618,
  //     carrierNum: 1,
  //     alarmNum: 1,
  //     warningNum: 2,
  //   },
  // ];
  // return json ? new StatsSummaryData({ rows: json }) : undefined;
  return json ? new StatsSummaryData(json) : undefined;
}

export function useZoneStats(arg: Arg) {
  return useSWR('/api/stats/zone-stats', (url) => fetcher(url, { arg }));
}
