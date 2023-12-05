import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('redis/useTcmNetwork');
export interface Arg {
  tcm_id: number;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<{ port: number }, Arg>({ url, arg });
  logger(res);

  return res;
}

export function useTcmNetwork() {
  return useSWR('/api/redis/info/get-tcm-port', fetcher);
}
