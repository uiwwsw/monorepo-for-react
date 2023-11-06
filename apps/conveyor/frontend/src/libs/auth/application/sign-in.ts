// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { mockData } from '../domain';
import { createLogger } from '@package-frontend/utils';
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
  await new Promise((res) => setTimeout(res, 5000));
  return mockData;
  //   return await http({ url });
}

export function useSignIn() {
  return useSWR('/sign-in', fetcher);
}
