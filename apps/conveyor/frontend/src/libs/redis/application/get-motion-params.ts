import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { MotionParameters } from '../domain';

const logger = createLogger('redis/useMotionParams');

async function fetcher(url: string) {
  const res = await http<MotionParameters>({ url });
  logger(res);

  return res;
}

export function useMotionParams() {
  return useSWR('/api/redis/motion-parameter-info', fetcher);
}
