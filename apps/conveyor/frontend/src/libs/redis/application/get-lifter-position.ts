import { http } from '#/ondhttp';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('redis/useLifterPosition');
export interface Arg {
  zone_id: string;
  level: number;
  position: number;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<unknown, Arg>({ url, arg });
  logger(res);

  return res;
}

export function useLifterPosition() {
  return useSWR('/api/redis/attribute-lifter/position', fetcher);
}
