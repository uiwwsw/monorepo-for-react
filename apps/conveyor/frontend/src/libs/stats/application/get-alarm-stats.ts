// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { http, toJson } from '#/http';
import { AlarmStatsInRequest, AlarmStatsResponse } from '@package-backend/types';
import { StatsAlarmData } from '../domain';

export interface Arg extends Omit<AlarmStatsInRequest, 'start_time' | 'end_time'> {
  start_time: string;
  end_time: string;
}

const logger = createLogger('stats/useAlarmStats');
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
  const json = await toJson<AlarmStatsResponse>(res);
  return json ? new StatsAlarmData(json) : undefined;
}

export function useAlarmStats(arg: Arg) {
  return useSWR(['/api/stats/alarm-stats', arg], ([url, arg]) => fetcher(url, { arg }));
}
