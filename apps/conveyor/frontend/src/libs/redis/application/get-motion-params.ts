import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { MotionParameters } from '../domain';

const logger = createLogger('redis/useMotionParams');

async function fetcher(url: string) {
  const res = await http({ url });
  logger(res);
  const json = await toJson<MotionParameters>(res);
  return json;
}

export function useMotionParams() {
  return useSWR('/api/redis/motion-parameter-info', fetcher);
}
