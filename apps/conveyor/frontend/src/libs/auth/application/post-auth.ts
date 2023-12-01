import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
import { Auth } from '../domain';
import { createLogger } from '@package-frontend/utils';
import { mutate } from 'swr';
const logger = createLogger('auth/usePostAuth');

async function fetcher(arg: Auth | undefined) {
  await mutate(STORAGE['auth'], arg);
  storage.set(STORAGE['auth'], arg);
  logger(arg);
}

export function usePostAuth() {
  return fetcher;
}
