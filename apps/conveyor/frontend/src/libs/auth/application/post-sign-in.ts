// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger, fakeApi, http } from '@package-frontend/utils';
import { usePostAuth } from './post-auth';
import { Auth } from '../domain';
import { MD5 } from "crypto-js";

const logger = createLogger('auth/useSignIn');

async function fetcher(
  url: string,
  {
    arg: {
      id, pw
    },
  }: {
    arg: {
      id: string;
      pw: string;
    };
  },
) {
  const res = await http<Auth>({url,
    method:'POST',
     arg: {
    "username": id,
    "password": MD5(pw).toString()
  }});
  logger(res)
  const trigger = usePostAuth();
  await trigger(res);

  return res;
}

export function useSignIn() {
  return useSWR('/api/users/sign-in', fetcher);
}
