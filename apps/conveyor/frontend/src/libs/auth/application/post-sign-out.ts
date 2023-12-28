// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { http } from '#/http';
import { usePostAuth } from './post-auth';
import { Auth } from '../domain';
const logger = createLogger('auth/useSignOut');

async function fetcher(url: string, trigger: (arg?: Auth) => Promise<Auth | undefined>) {
  logger(url);
  const res = await http({ url, method: 'POST' });
  await trigger(undefined);
  logger(res.ok);
  if (res.ok) return true;
  return false;
  //   return await http({ url });
}

export function useSignOut() {
  const { trigger } = usePostAuth();

  return useSWR('/api/users/sign-out', (url) => fetcher(url, trigger));
}
