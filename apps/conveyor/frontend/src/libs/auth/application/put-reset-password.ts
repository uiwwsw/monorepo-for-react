// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { MD5 } from 'crypto-js';
import { http } from '#/http';

const logger = createLogger('auth/useResetPassword');
export interface Arg {
  id: string;
  pw: string;
}
async function fetcher(
  url: string,
  {
    arg: { id, pw },
  }: {
    arg: Arg;
  },
) {
  const res = await http({
    url,
    method: 'PUT',
    arg: {
      user_id: id,
      password: MD5(pw).toString(),
    },
  });
  logger(res);
  if (res.ok) return true;
  return false;
}

export function useResetPassword() {
  return useSWR('/api/users/reset-password', fetcher);
}
