// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { mockData } from '../domain';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { usePostAuth } from './post-auth';
const logger = createLogger('auth/useSignIn');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      id: string;
      pw: string;
    };
  },
) {
  if (arg.id !== 'admin' || arg.pw !== 'admin') throw new Error('아이디 또는 비번이 틀렸습니다.');

  const res = await fakeApi(mockData);
  const trigger = usePostAuth();
  await trigger(res);
  logger(url, arg, res);

  return res;
}

export function useSignIn() {
  return useSWR('/sign-in', fetcher);
}
