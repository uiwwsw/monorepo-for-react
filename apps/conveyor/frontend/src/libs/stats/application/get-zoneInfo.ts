// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr';
import { SearchZoneArg, StatsZoneData } from '../domain';
const logger = createLogger('stats/useGetZoneInfo');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: SearchZoneArg;
  },
) {
  logger(url, arg);
  const zones: StatsZoneData[] = [
    { zoneID: 102032, displayName: '102032', alarmNum: 1, carrierNum: 0, warningNum: 1 },
    { zoneID: 102033, displayName: '102033', alarmNum: 2, carrierNum: 7, warningNum: 0 },
    { zoneID: 102034, displayName: '102034', alarmNum: 3, carrierNum: 5, warningNum: 0 },
  ];
  const zones2: StatsZoneData[] = [
    { zoneID: 102035, displayName: '102035', alarmNum: 1, carrierNum: 0, warningNum: 1 },
    { zoneID: 102036, displayName: '102036', alarmNum: 2, carrierNum: 7, warningNum: 0 },
    { zoneID: 102037, displayName: '102037', alarmNum: 3, carrierNum: 5, warningNum: 0 },
  ];
  if (arg.pageNum === 1) {
    return fakeApi(zones);
  } else if (arg.pageNum === 2) {
    return fakeApi(zones2);
  } else return fakeApi(null);
  //   return await http({ url });
}

export function useGetZoneInfo({ arg }: { arg: SearchZoneArg }) {
  return useSWR('/get-zoneInfo', (url) => fetcher(url, { arg }));
}
