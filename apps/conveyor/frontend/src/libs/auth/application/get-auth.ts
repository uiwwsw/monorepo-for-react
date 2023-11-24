// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { Auth } from '../domain';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { AUTH_STORAGE } from '!/storage/domain';
const logger = createLogger('auth/useGetAuth');

function fetcher(url: string) {
  const res = LocalStorage.get<Auth>(url);
  logger(res);

  return res ?? null;
  //   return await http({ url });
}

export function useGetAuth() {
  return useSWR(AUTH_STORAGE['/check-auth'], fetcher);
}
