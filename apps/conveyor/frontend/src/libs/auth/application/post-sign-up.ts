// import { http } from '@package-frontend/utils';
import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
const logger = createLogger('auth/useSignUp');
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

  return fakeApi(true);
  //   return await http({ url });
}

export function useSignUp() {
  return useSWR('/sign-up', fetcher);
}
