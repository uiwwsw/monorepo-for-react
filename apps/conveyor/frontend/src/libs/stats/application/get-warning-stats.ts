// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { http, toJson } from '#/http';
import { StatsWarningData, WarningStatsInRequest, WarningStatsResponse } from '../domain';
import { Arg as StatsArg } from './get-zone-stats';
export interface Arg extends Omit<WarningStatsInRequest, 'start_time' | 'end_time'>, StatsArg {}

const logger = createLogger('stats/useWarningStats');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: Arg;
  },
) {
  const res = await http<Arg>({ url, arg, method: 'POST' });
  logger(url, arg, res);
  const json = await toJson<WarningStatsResponse>(res);
  return json ? new StatsWarningData(json) : undefined;
}

export function useWarningStats(arg: Arg) {
  return useSWR(['/api/stats/warning-stats', arg], ([url, arg]) => fetcher(url, { arg }));
}
