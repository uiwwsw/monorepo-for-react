// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { ZoneList } from '../domain';
import { http } from '#/ondhttp';

const logger = createLogger('stats/useZoneList');
async function fetcher(url: string) {
  logger(url);
  const res = await http<ZoneList>({
    url,
  });
  logger(res);

  return res;
}

export function useZoneList() {
  return useSWR('/api/zone/zone-list', fetcher);
}
