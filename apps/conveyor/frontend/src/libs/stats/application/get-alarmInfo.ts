// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { SearchArg } from '../domain';
import { StatsAlarmData } from '../domain';
const logger = createLogger('stats/useGetGraphInfo');
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
      carrierID: 'UNKNOWN_1',
      zoneID: 10101,
      setTime: '2023-11-11 01:00:00',
      clearTime: '2023-11-11 01:10:00',
      description: 'unknown error',
    },
  ];
  return fakeApi(data);
  //   return await http({ url });
}

export function useGetAlarmInfo() {
  return useSWR('/get-alarmInfo', fetcher);
}
