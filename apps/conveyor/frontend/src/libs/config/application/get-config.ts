import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { Config } from '../domain';

const logger = createLogger('control/useConfig');

async function fetcher(url: string): Promise<Config> {
  logger(url);

  const res = await fetch(url);
  try {
    const json = await res.json();
    return json;
  } catch {
    return {
      WS_API: process.env.WS_API!,
      API: process.env.API!,
    };
  }
}

export function useConfig() {
  return useSWR('/config', fetcher);
}
