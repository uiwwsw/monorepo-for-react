// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { Auth } from '../domain';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { mutate } from 'swr';
const logger = createLogger('auth/usePostAuth');

function fetcher(arg: Auth | undefined) {
  mutate('/check-auth', arg);
  LocalStorage.set('/check-auth', arg);
  logger(arg);

  return arg ?? null;
}

export function usePostAuth() {
  return fetcher;
}
