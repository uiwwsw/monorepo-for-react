// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ZoneList } from '../domain';

const logger = createLogger('stats/useGetZoneList');
async function fetcher(url: string) {
  logger(url);
  const zones: ZoneList[] = [
    { zoneID: 10101, displayName: '10101' },
    { zoneID: 10102, displayName: '10102' },
    { zoneID: 10103, displayName: '10103' },
    { zoneID: 10104, displayName: '10104' },
    { zoneID: 10105, displayName: '10105' },
    { zoneID: 10106, displayName: '10106' },
    { zoneID: 10107, displayName: '10107' },
    { zoneID: 10201, displayName: '10201' },
    { zoneID: 10202, displayName: '10202' },
  ];

  return fakeApi(zones);
  //   return await http({ url });
}

export function useGetZoneList() {
  return useSWR('/get-zoneList', fetcher);
}
