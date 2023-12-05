// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { StatsCarrierData } from '../domain';
import { http } from '#/http';
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
  logger(url, arg);
  //temporary
  // const data: StatsCarrierData = {
  //   rows: [
  //     {
  //       CarrierID: 'UNKNOWN_1',
  //       TaskID: 0,
  //       CommandID: '',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN02',
  //       StartTime: '2023-11-11 01:00:00',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:10:00',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_2',
  //       TaskID: 1,
  //       CommandID: '0',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN03',
  //       StartTime: '2023-11-11 01:03:07',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:13:12',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_1',
  //       TaskID: 0,
  //       CommandID: '',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN02',
  //       StartTime: '2023-11-11 01:00:00',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:10:00',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_2',
  //       TaskID: 1,
  //       CommandID: '0',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN03',
  //       StartTime: '2023-11-11 01:03:07',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:13:12',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_1',
  //       TaskID: 0,
  //       CommandID: '',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN02',
  //       StartTime: '2023-11-11 01:00:00',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:10:00',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_2',
  //       TaskID: 1,
  //       CommandID: '0',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN03',
  //       StartTime: '2023-11-11 01:03:07',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:13:12',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_1',
  //       TaskID: 0,
  //       CommandID: '',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN02',
  //       StartTime: '2023-11-11 01:00:00',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:10:00',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_2',
  //       TaskID: 1,
  //       CommandID: '0',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN03',
  //       StartTime: '2023-11-11 01:03:07',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:13:12',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_1',
  //       TaskID: 0,
  //       CommandID: '',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN02',
  //       StartTime: '2023-11-11 01:00:00',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:10:00',
  //     },
  //     {
  //       CarrierID: 'UNKNOWN_2',
  //       TaskID: 1,
  //       CommandID: '0',
  //       ZoneIDFrom: 10101,
  //       ZoneIDTo: 10103,
  //       ZoneIDFromName: '4AFC3301A_IN03',
  //       StartTime: '2023-11-11 01:03:07',
  //       ZoneIDToName: '4AFC3301A_OUT02',
  //       EndTime: '2023-11-11 01:13:12',
  //     },
  //   ],
  //   total_count: 20,
  // };
  // return fakeApi(data);
  const res = await http<StatsCarrierData, Arg>({
    url,
    method: 'POST',
    arg,
  });
  logger(res);

  return res;
}

export function useCarrierStats(arg: Arg) {
  return useSWR(['/api/stats/carrier-stats', arg], ([url, arg]) => fetcher(url, { arg }));
}
