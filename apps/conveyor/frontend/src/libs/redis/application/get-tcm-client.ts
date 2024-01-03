import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { TcmClient } from '../domain';

const logger = createLogger('redis/useCheckTcmClient');
export interface Arg {
  tcm_id: number;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<Arg>({ url, param: arg });
  logger(res);
  const json = await toJson<{
    state: {
      tcm_id: number;
      alive: number;
    }[];
    write_log: number;
  }>(res);
  logger(json);
  if (json) {
    return new TcmClient(json);
  } else {
    return undefined;
  }
}
export function useCheckTcmClient() {
  return useSWR('/api/redis/check-tcm-client', fetcher);
}
