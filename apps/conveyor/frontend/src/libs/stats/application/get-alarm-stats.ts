// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsAlarmData } from '../domain';
import { http } from '#/http';

export interface Arg {
  start_time: string;
  end_time: string;
  page: number;
  page_size: number;
  find_key?: string;
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
  logger(url, arg);
  //temporary
  // const data: StatsAlarmData = {
  //   rows: [
  //     {
  //       No: 1,
  //       SerialNo: 0,
  //       AlarmCode: 10100,
  //       TaskID: 0,
  //       Location: 10101,
  //       Reason: 100,
  //       CommandID: '1001',
  //       TCMID: 101,
  //       CarrierID: 'UNKNOWN_1',
  //       SetTime: '2023-11-01 01:01:01',
  //       ClearTime: '2023-11-01 01:13:29',
  //     },
  //     {
  //       No: 2,
  //       SerialNo: 0,
  //       AlarmCode: 10200,
  //       TaskID: 0,
  //       Location: 10203,
  //       Reason: 100,
  //       CommandID: '1001',
  //       TCMID: 102,
  //       CarrierID: 'UNKNOWN_2',
  //       SetTime: '2023-11-01 02:01:01',
  //       ClearTime: '2023-11-01 02:15:32',
  //     },
  //   ],
  //   total_count: 2,
  // };
  const res = await http<StatsAlarmData>({ url, arg, method: 'POST' });
  logger(res);

  return res;
}

export function useAlarmStats(arg: Arg) {
  return useSWR('/api/stats/alarm-stats', (url) => fetcher(url, { arg }));
}
