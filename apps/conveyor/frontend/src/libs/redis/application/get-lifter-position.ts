import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('redis/useLifterPosition');
export interface Arg {
  zone_id: string;
  level: number;
  position: number;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<Arg>({ url, arg });
  logger(res);
  if (res.ok) return true;
  return false;
}

export function useLifterPosition() {
  return useSWR('/api/redis/attribute-lifter/position', fetcher);
}
