// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { mockData } from '../domain';
import { createLogger, fakeApi } from '@package-frontend/utils';
const logger = createLogger('server/useServerInfo');

async function fetcher(url: string) {
  logger(url);
  const res = await fakeApi(mockData);
  return res;
  //   return await http({ url });
}

export function useServerInfo() {
  return useSWR('/serverInfo', fetcher);
}
