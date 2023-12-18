import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
const logger = createLogger('control/useTcmLogList');
export interface Arg {
  address: string;
  port: number;
}
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: Arg;
  },
) {
  logger(url, arg);

  const res = await http({ url, arg, contentType: 'application/x-www-form-urlencoded' });
  const json = await toJson<{ files: string[] }>(res);
  return json?.files;
}

export function useTcmLogList() {
  return useSWR('/api/api/tcm/log/list', fetcher);
}
