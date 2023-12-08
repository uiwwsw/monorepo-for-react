import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { OffsetInfo } from '../domain';

const logger = createLogger('redis/useOffsetInfo');
export interface Arg {
  zone_id: number;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<Arg>({ url, arg });
  logger(res);
  const json = await toJson<OffsetInfo>(res);
  return json;
}

export function useOffsetInfo() {
  return useSWR('/api/redis/offset-info', fetcher);
}
