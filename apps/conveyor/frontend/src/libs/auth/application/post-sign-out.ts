// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { http } from '#/http';
import { usePostAuth } from './post-auth';
const logger = createLogger('auth/useSignOut');

async function fetcher(url: string) {
  logger(url);
  const trigger = usePostAuth();
  await trigger(undefined);
  const res = await http({ url, method: 'POST' });
  return res;
  //   return await http({ url });
}

export function useSignOut() {
  return useSWR('/api/users/sign-out', fetcher);
}
