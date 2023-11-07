// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { Auth, mockData } from '../domain';
import { LocalStorage, createLogger } from '@package-frontend/utils';
const logger = createLogger('auth/useCheckAuth');

function fetcher(url: string) {
  logger(url);
  const res = LocalStorage.get<Auth>(url);
  logger(res);
  return res;
  //   return await http({ url });
}

export function useCheckAuth() {
  return useSWR('/check-auth', fetcher);
}
