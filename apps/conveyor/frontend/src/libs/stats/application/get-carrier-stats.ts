// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsCarrierData } from '../domain';
import { http, toJson } from '#/http';
import { CarrierStatsInRequest } from '@package-backend/types';
const logger = createLogger('stats/useCarrierStats');
export interface Arg extends Omit<CarrierStatsInRequest, 'start_time' | 'end_time'> {
  start_time: string;
  end_time: string;
}
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
  const json = await toJson<StatsCarrierData>(res);
  return json;
}

export function useCarrierStats(arg: Arg) {
  return useSWR(['/api/stats/carrier-stats', arg], ([url, arg]) => fetcher(url, { arg }));
}
