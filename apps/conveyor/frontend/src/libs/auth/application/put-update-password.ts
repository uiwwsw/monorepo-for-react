// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { usePostAuth } from './post-auth';
import { MD5 } from 'crypto-js';
import { http, toJson } from '#/http';
import { UserPasswordRequest } from '@package-backend/types';

const logger = createLogger('auth/useUpdatePassword');

async function fetcher(
  url: string,
  {
    arg: { pw },
  }: {
    arg: {
      pw: string;
    };
  },
) {
  const res = await http<UserPasswordRequest>({
    url,
    method: 'PUT',
    arg: {
      password: MD5(pw).toString(),
    },
  });
  logger(res);
  await toJson(res);
  const trigger = usePostAuth();
  await trigger(undefined);

  return res;
}

export function useUpdatePassword() {
  return useSWR('/api/users/user-password', fetcher);
}
