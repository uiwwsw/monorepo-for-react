// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger, fakeApi } from '@package-frontend/utils';
const logger = createLogger('zone/useBlahblah');

async function fetcher(url: string) {
  logger(url);
  const res = await fakeApi();
  return res;
  //   return await http({ url });
}

export function useBlahblah() {
  return useSWR('/blah', fetcher);
}
