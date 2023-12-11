// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { usePostAuth } from './post-auth';
import { Auth } from '../domain';
import { MD5 } from 'crypto-js';
import { http, toJson } from '#/http';
import { SignInRequest, SignInResponse } from '@package-backend/types';

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
  logger(url);

  const res = await http<SignInRequest>({
    url,
    method: 'POST',
    arg: {
      user_id: id,
      password: MD5(pw).toString(),
    },
  });
  logger(res.ok);
  const json = await toJson<SignInResponse>(res);
  const trigger = usePostAuth();
  if (json) {
    await trigger(new Auth(json));
  } else {
    await trigger(undefined);
  }

  return res;
}

export function useSignIn() {
  return useSWR('/api/users/sign-in', fetcher);
}
