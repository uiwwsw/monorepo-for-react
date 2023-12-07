// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsSummaryData } from '../domain';
import { http, toJson } from '#/http';

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
  const json = await toJson<StatsSummaryData>(res);
  return json;
}

export function useZoneStats(arg: Arg) {
  return useSWR('/api/stats/zone-stats', (url) => fetcher(url, { arg }));
}
