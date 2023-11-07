// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { Auth, mockData } from '../domain';
import { LocalStorage, createLogger, fakeApi } from '@package-frontend/utils';
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
  const res = await fakeApi(mockData);
  LocalStorage.set('/check-auth', res);
  return res;
  //   return await http({ url });
}

export function useSignIn() {
  return useSWR('/sign-in', fetcher);
}
