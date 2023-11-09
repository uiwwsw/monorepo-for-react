// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { mockData } from '../domain';
import { LocalStorage, createLogger, fakeApi } from '@package-frontend/utils';
import { mutate } from 'swr';
const logger = createLogger('auth/useSignout');

async function fetcher(url: string) {
  logger(url);
  LocalStorage.set('/check-auth', '');
  await mutate('/check-auth', undefined);
  const res = await fakeApi(mockData);
  return res;
  //   return await http({ url });
}

export function useSignout() {
  return useSWR('/sign-out', fetcher);
}
