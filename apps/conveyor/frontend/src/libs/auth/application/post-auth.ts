import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
import { Auth } from '../domain';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
const logger = createLogger('auth/usePostAuth');

async function fetcher(url: STORAGE, { arg }: { arg?: Auth | undefined }) {
  storage.set(url, arg);
  logger(arg);
  return arg;
}

export function usePostAuth() {
  return useSWR(STORAGE['auth'], fetcher);
}
