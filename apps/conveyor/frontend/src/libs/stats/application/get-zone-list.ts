// import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { ZoneList } from '../domain';
import { http, toJson } from '#/http';

const logger = createLogger('stats/useZoneList');
async function fetcher(url: string) {
  const res = await http({
    url,
  });
  logger(url, res);

  const json = await toJson<ZoneList>(res);
  return json;
}

export function useZoneList() {
  return useSWR('/api/zone/zone-list', fetcher);
}
