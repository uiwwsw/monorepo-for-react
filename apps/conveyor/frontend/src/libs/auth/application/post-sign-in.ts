// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '#/logger';
import { usePostAuth } from './post-auth';
import { Auth } from '../domain';
import { MD5 } from 'crypto-js';
import { http } from '#/http';
import { SignInRequest } from '@package-backend/types';

const logger = createLogger('auth/useSignIn');

async function fetcher(
  url: string,
  {
    arg: { id, pw },
  }: {
    arg: {
      id: string;
      pw: string;
    };
  },
) {
  const res = await http<Auth, SignInRequest>({
    url,
    method: 'POST',
    arg: {
      user_id: id,
      password: MD5(pw).toString(),
    },
  });
  logger(res);
  const trigger = usePostAuth();
  await trigger(res);

  return res;
}

export function useSignIn() {
  return useSWR('/api/users/sign-in', fetcher);
}
