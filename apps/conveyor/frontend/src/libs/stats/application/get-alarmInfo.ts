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
      No: 1,
      SerialNo: 0,
      AlarmCode: 10100,
      TaskID: 0,
      Location: 10101,
      Reason: 100,
      CommandID: '1001',
      TCMID: 101,
      CarrierID: 'UNKNOWN_1',
      SetTime: '2023-11-01 01:01:01',
      ClearTime: '2023-11-01 01:13:29',
    },
    {
      No: 2,
      SerialNo: 0,
      AlarmCode: 10200,
      TaskID: 0,
      Location: 10203,
      Reason: 100,
      CommandID: '1001',
      TCMID: 102,
      CarrierID: 'UNKNOWN_2',
      SetTime: '2023-11-01 02:01:01',
      ClearTime: '2023-11-01 02:15:32',
    },
  ];
  const res = await fakeApi(data);
  return res;
  //   return await http({ url });
}

export function useGetAlarmInfo({ arg }: { arg: SearchArg }) {
  return useSWR('/get-alarmInfo', (url) => fetcher(url, { arg }));
}
