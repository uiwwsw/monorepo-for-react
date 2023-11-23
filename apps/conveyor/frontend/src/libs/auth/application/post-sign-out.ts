// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger, http } from '@package-frontend/utils';
import { usePostAuth } from './post-auth';
const logger = createLogger('auth/useSignout');

async function fetcher(url: string) {
  logger(url);
  const trigger = usePostAuth();
  await trigger(undefined);
  const res = await http({ url });
  return res;
  //   return await http({ url });
}

export function useSignout() {
  return useSWR('/api/users/sign-out', fetcher);
}
