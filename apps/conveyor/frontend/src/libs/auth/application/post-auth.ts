import { Auth } from '../domain';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { mutate } from 'swr';
const logger = createLogger('auth/usePostAuth');

async function fetcher(arg: Auth | undefined) {
  await mutate('/check-auth', arg);
  LocalStorage.set('/check-auth', arg);
  logger(arg);
}

export function usePostAuth() {
  return fetcher;
}
