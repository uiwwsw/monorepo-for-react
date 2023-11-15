// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { SearchArg } from '../domain';
import { StatsCarrierData } from '../domain';
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
  const data: StatsCarrierData[] = [
    {
      no: 1,
      carrierID: 'UNKNOWN_1',
      input: '4AFC3301A_IN02',
      installedTime: '2023-11-11 01:00:00',
      output: '4AFC3301A_OUT02',
      completeTime: '2023-11-11 01:10:00',
    },
  ];
  return fakeApi(data);
  //   return await http({ url });
}

export function useGetCarrierInfo() {
  return useSWR('/get-carrierInfo', fetcher);
}
