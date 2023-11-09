// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { Auth, mockData } from '../domain';
import { LocalStorage, createLogger, fakeApi } from '@package-frontend/utils';
import { mutate } from 'swr';
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
  logger(url, arg);
  if (arg.id !== 'admin' || arg.pw !== 'admin') throw new Error('아이디 또는 비번이 틀렸습니다.');

  const res = await fakeApi(mockData);
  LocalStorage.set('/check-auth', res);
  await mutate('/check-auth', res);
  return res;
}

export function useSignIn() {
  return useSWR('/sign-in', fetcher);
}
