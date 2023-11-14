// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { mockData } from '../domain';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { usePostAuth } from './post-auth';
const logger = createLogger('auth/useSignout');

async function fetcher(url: string) {
  logger(url);
  const trigger = usePostAuth();
  await trigger(undefined);
  const res = await fakeApi(mockData);
  return res;
  //   return await http({ url });
}

export function useSignout() {
  return useSWR('/sign-out', fetcher);
}
