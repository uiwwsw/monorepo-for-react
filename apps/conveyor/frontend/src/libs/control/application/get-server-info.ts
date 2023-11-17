// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { mockDataServer } from '../domain';
const logger = createLogger('server/useServerInfo');

async function fetcher(url: string) {
  logger(url);
  const res = await fakeApi(mockDataServer);
  return res;
  //   return await http({ url });
}

export function useServerInfo() {
  return useSWR('/serverInfo', fetcher);
}
