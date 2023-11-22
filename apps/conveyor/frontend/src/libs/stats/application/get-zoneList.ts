// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ZoneList } from '../domain';

const logger = createLogger('stats/useGetZoneList');
async function fetcher(url: string) {
  logger(url);
  const zones: ZoneList[] = [
    { No: 0, ZoneID: 10101, DisplayName: '10101', PhysicalType: 1 },
    { No: 1, ZoneID: 10102, DisplayName: '10102', PhysicalType: 1 },
    { No: 2, ZoneID: 10103, DisplayName: '10103', PhysicalType: 1 },
    { No: 3, ZoneID: 10104, DisplayName: '10104', PhysicalType: 1 },
    { No: 4, ZoneID: 10105, DisplayName: '10105', PhysicalType: 1 },
    { No: 5, ZoneID: 10106, DisplayName: '10106', PhysicalType: 1 },
    { No: 6, ZoneID: 10107, DisplayName: '10107', PhysicalType: 1 },
    { No: 7, ZoneID: 10201, DisplayName: '10201', PhysicalType: 1 },
    { No: 8, ZoneID: 10202, DisplayName: '10202', PhysicalType: 1 },
  ];

  return fakeApi(zones);
  //   return await http({ url });
}

export function useGetZoneList() {
  return useSWR('/get-zoneList', fetcher);
}
