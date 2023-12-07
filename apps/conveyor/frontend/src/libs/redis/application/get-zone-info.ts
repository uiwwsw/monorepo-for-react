import { http } from '#/ondhttp';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ZoneInfo } from '../domain';

const logger = createLogger('redis/useZoneInfo');
async function fetcher(url: string) {
  const res = await http<ZoneInfo>({ url });
  logger(res);

  return res;
}

export function useZoneInfo() {
  return useSWR('/api/redis/zone-info', fetcher);
}
