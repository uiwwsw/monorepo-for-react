// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { mockDataTCM } from '../domain';
const logger = createLogger('tcm/useTcmInfo');

async function fetcher(url: string) {
  logger(url);
  const res = await fakeApi(mockDataTCM);
  return res;
  //   return await http({ url });
}

export function useTcmInfo() {
  return useSWR('/tcmInfo', fetcher);
}
