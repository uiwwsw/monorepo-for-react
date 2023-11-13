// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { SearchArg } from '../domain';
const logger = createLogger('stats/useGetZoneInfo');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: SearchArg;
  },
) {
  logger(url, arg);
  return fakeApi(true);
  //   return await http({ url });
}

export function useGetZoneInfo() {
  return useSWR('/get-zoneInfo', fetcher);
}
