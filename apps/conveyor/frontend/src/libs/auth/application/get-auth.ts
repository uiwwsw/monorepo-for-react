// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { Auth } from '../domain';
import { createLogger } from '#/logger';
import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
const logger = createLogger('auth/useGetAuth');

function fetcher() {
  const res = storage.get<Auth>(STORAGE['auth']);
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
