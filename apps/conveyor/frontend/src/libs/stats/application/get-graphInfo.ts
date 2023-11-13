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
        transfer: 100,
        alarm: 100,
        date: '2023-11-13',
      },
    ],
  };
  return fakeApi(data);
  //   return await http({ url });
}

export function useGetGraphInfo() {
  return useSWR('/get-graphInfo', fetcher);
}
