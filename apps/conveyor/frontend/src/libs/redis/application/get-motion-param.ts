import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { MotionParameter } from '../domain';

const logger = createLogger('redis/useMotionParam');
export interface Arg {
  zone_id: number;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<MotionParameter, Arg>({ url, arg });
  logger(res);

  return res;
}

export function useMotionParam() {
  return useSWR('/api/redis/motion-parameter-ex-info', fetcher);
}
