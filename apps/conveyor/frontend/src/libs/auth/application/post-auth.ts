import { STORAGE } from '!/storage/domain';
import { Auth } from '../domain';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { mutate } from 'swr';
const logger = createLogger('auth/usePostAuth');

async function fetcher(arg: Auth | undefined) {
  await mutate(STORAGE['/check-auth'], arg);
  LocalStorage.set(STORAGE['/check-auth'], arg);
  logger(arg);
}

export function usePostAuth() {
  return fetcher;
}
