// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { Auth } from '../domain';
import { createLogger } from '@package-frontend/utils';
import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
const logger = createLogger('auth/useGetAuth');

function fetcher(url: STORAGE) {
  const res = storage.get<Auth>(url);
  logger(res);
  return res ?? null;
}

export function useGetAuth() {
  return useSWR(STORAGE['auth'], fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
  });
}
