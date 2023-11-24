// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import { http } from '#/http';
import { MD5 } from 'crypto-js';
import useSWR from 'swr/mutation';
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
  const res = await http<{ grade: number }>({
    url,
    method: 'POST',
    arg: {
      user_id: id,
      username: name,
      password: MD5(pw).toString(),
    },
  });
  logger(res);

  return res;
}

export function useSignUp() {
  return useSWR('/api/users/sign-up', fetcher);
}
