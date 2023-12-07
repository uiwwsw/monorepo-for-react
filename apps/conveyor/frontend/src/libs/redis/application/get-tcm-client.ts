import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { TcmClient } from '../domain';

const logger = createLogger('redis/useCheckTcmClient');
export interface Arg {
  tcm_id: number;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<Arg>({ url, arg });
  logger(res);
  const json = await toJson<TcmClient>(res);

  return json;
}

export function useCheckTcmClient() {
  return useSWR('/api/redis/check-tcm-client', fetcher);
}
