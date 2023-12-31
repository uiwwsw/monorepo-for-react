// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsCarrierData } from '../domain';
import { http, toJson } from '#/http';
import { CarrierStatsInRequest, CarrierStatsResponse } from '@package-backend/types';
import { Arg as StatsArg } from './get-zone-stats';
const logger = createLogger('stats/useCarrierStats');
export interface Arg extends Omit<CarrierStatsInRequest, 'start_time' | 'end_time'>, StatsArg {}
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
  const json = await toJson<CarrierStatsResponse>(res);
  return json ? new StatsCarrierData(json) : undefined;
}

export function useCarrierStats(arg: Arg) {
  return useSWR(['/api/stats/carrier-stats', arg], ([url, arg]) => fetcher(url, { arg }));
}
