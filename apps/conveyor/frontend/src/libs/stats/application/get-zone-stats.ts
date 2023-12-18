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
  return json ? new StatsSummaryData(json) : undefined;
}

export function useZoneStats(arg: Arg) {
  return useSWR('/api/stats/zone-stats', (url) => fetcher(url, { arg }));
}
