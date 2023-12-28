// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { usePostAuth } from './post-auth';
import { MD5 } from 'crypto-js';
import { http } from '#/http';
import { UserPasswordRequest } from '@package-backend/types';
import { Auth } from '../domain';

const logger = createLogger('auth/useUpdatePassword');
export interface Arg {
  pw: string;
}
async function fetcher(
  url: string,
  {
    arg: { pw },
  }: {
    arg: Arg;
  },
  trigger: (arg?: Auth) => Promise<Auth | undefined>,
) {
  const res = await http<UserPasswordRequest>({
    url,
    method: 'PUT',
    arg: {
      password: MD5(pw).toString(),
    },
  });
  logger(res);
  if (res.ok) {
    await trigger(undefined);
    return true;
  }
  return false;
}

export function useUpdatePassword() {
  const { trigger } = usePostAuth();

  return useSWR('/api/users/user-password', (url, { arg }: { arg: Arg }) => fetcher(url, { arg }, trigger));
}
