// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr';
import { SearchArg } from './get-alarmInfo';
import { StatsCarrierData } from '../domain';
const logger = createLogger('stats/useGetCarrierInfo');
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
  const data: StatsCarrierData = {
    rows: [
      {
        CarrierID: 'UNKNOWN_1',
        TaskID: 0,
        CommandID: '',
        ZoneIDFrom: 10101,
        ZoneIDTo: 10103,
        ZoneIDFromName: '4AFC3301A_IN02',
        StartTime: '2023-11-11 01:00:00',
        ZoneIDToName: '4AFC3301A_OUT02',
        EndTime: '2023-11-11 01:10:00',
      },
      {
        CarrierID: 'UNKNOWN_2',
        TaskID: 1,
        CommandID: '0',
        ZoneIDFrom: 10101,
        ZoneIDTo: 10103,
        ZoneIDFromName: '4AFC3301A_IN03',
        StartTime: '2023-11-11 01:03:07',
        ZoneIDToName: '4AFC3301A_OUT02',
        EndTime: '2023-11-11 01:13:12',
      },
    ],
    total_count: 2,
  };
  return fakeApi(data);
  //   return await http({ url });
}

export function useGetCarrierInfo({ arg }: { arg: SearchArg }) {
  return useSWR('/get-carrierInfo', (url) => fetcher(url, { arg }));
}
