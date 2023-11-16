// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { SearchArg } from '../domain';
import { StatsGraphData } from '../domain';
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
  const data: StatsGraphData = {
    port: 'All',
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
  return data;
  //   return await http({ url });
}

export function useGetGraphInfo() {
  return useSWR('/get-graphInfo', fetcher);
}
