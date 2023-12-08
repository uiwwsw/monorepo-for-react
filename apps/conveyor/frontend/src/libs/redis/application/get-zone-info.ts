import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ZoneInfo } from '../domain';

const logger = createLogger('redis/useZoneInfo');
async function fetcher(url: string) {
  const res = await http({ url });
  logger(res);
  const json = await toJson<ZoneInfo>(res);
  return json;
}

export function useZoneInfo() {
  return useSWR('/api/redis/zone-info', fetcher);
}
