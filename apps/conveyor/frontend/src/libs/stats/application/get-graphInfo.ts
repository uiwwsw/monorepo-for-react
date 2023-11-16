// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr';
import { SearchZoneArg } from '../domain';
import { StatsGraphData } from '../domain';
const logger = createLogger('stats/useGetGraphInfo');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: SearchZoneArg;
  },
) {
  logger(url, arg);
  //temporary
  const data: StatsGraphData = {
    port: 'ALL',
    data: [
      {
        transfer: 177,
        alarm: 0,
        date: '2023-11-13',
      },
      {
        transfer: 213,
        alarm: 2,
        date: '2023-11-14',
      },
      {
        transfer: 165,
        alarm: 1,
        date: '2023-11-15',
      },
    ],
  };

  if (arg.zoneID !== -1) {
    return fakeApi({
      port: `${arg.zoneID}`,
      data: [
        {
          transfer: 51,
          alarm: 1,
          date: '2023-11-13',
        },
        {
          transfer: 25,
          alarm: 0,
          date: '2023-11-14',
        },
        {
          transfer: 43,
          alarm: 3,
          date: '2023-11-15',
        },
      ],
    });
  } else return fakeApi(data);
  //   return await http({ url });
}

export function useGetGraphInfo({ arg }: { arg: SearchZoneArg }) {
  return useSWR('/get-graphInfo', (url) => fetcher(url, { arg }));
}
