import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { Config } from '../domain';

const logger = createLogger('control/useConfig');

async function fetcher(url: string): Promise<Config> {
  logger(url);

  const res = await fetch(url);
  const json = await res.json();
  return json;
}

export function useConfig() {
  return useSWR('/config.json', fetcher);
}
