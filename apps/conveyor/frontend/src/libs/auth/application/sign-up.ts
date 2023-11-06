// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
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
  await new Promise((res) => setTimeout(res, 5000));
  return true;
  //   return await http({ url });
}

export function useSignUp() {
  return useSWR('/sign-up', fetcher);
}
