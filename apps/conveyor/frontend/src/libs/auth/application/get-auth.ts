// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { Auth } from '../domain';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { STORAGE } from '!/storage/domain';
import { HttpError } from '#/http';
const logger = createLogger('auth/useGetAuth');

function fetcher(url: string) {
  const res = LocalStorage.get<Auth>(url);
  logger(res);
  if (res) return res;
  throw new HttpError('Forbidden', { status: 403 });
  //   return await http({ url });
}

export function useGetAuth() {
  return useSWR(STORAGE['auth'], fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
  });
}
