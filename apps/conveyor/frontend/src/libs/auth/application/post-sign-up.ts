// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import { http, toJson } from '#/http';
import { MD5 } from 'crypto-js';
import useSWR from 'swr/mutation';
import { SignUpRequest, SignUpResponse } from '@package-backend/types';
const logger = createLogger('auth/useSignUp');
async function fetcher(
  url: string,
  {
    arg: { id, name, pw },
  }: {
    arg: {
      id: string;
      name: string;
      pw: string;
    };
  },
) {
  logger(url, { id, name, pw });
  const res = await http<SignUpRequest>({
    url,
    method: 'POST',
    arg: {
      user_id: id,
      username: name,
      password: MD5(pw).toString(),
    },
  });
  const json = await toJson<SignUpResponse>(res);

  return json;
}

export function useSignUp() {
  return useSWR('/api/users/sign-up', fetcher);
}
