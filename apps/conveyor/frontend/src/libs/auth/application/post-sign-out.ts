// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { http } from '#/ondhttp';
import { usePostAuth } from './post-auth';
const logger = createLogger('auth/useSignOut');

async function fetcher(url: string) {
  logger(url);
  const res = await http({ url, method: 'POST' });
  const trigger = usePostAuth();
  await trigger(undefined);
  return res;
  //   return await http({ url });
}

export function useSignOut() {
  return useSWR('/api/users/sign-out', fetcher);
}
