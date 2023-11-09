// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { searchArg } from '../domain';
const logger = createLogger('stats/useGetZoneInfo');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: searchArg;
  },
) {
  logger(url, arg);
  return fakeApi(true);
  //   return await http({ url });
}

export function useGetZoneInfo() {
  return useSWR('/get-zoneInfo', fetcher);
}
