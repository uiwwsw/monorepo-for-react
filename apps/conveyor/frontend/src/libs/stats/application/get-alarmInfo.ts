// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsAlarmData } from '../domain';

export interface SearchArg {
  startTime: string;
  endTime: string;
  character?: string;
}

const logger = createLogger('stats/useGetAlarmInfo');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: SearchArg;
  },
) {
  logger(url, arg);
  //temporary
  const data: StatsAlarmData[] = [
    {
      no: 1,
      carrierID: 'UNKNOWN_1',
      zoneID: 10101,
      setTime: '2023-11-01 01:01:01',
      clearTime: '2023-11-01 01:13:29',
      description: 'unknown error',
    },
    {
      no: 2,
      carrierID: 'UNKNOWN_1',
      zoneID: 10102,
      setTime: '2023-11-01 02:01:01',
      clearTime: '2023-11-01 02:15:32',
      description: '',
    },
  ];
  const res = await fakeApi(data);
  return res;
  //   return await http({ url });
}

export function useGetAlarmInfo({ arg }: { arg: SearchArg }) {
  return useSWR('/get-alarmInfo', (url) => fetcher(url, { arg }));
}