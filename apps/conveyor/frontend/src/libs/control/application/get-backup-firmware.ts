import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
const logger = createLogger('control/useFirmList');
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

  const res = await http({ url, param: arg, contentType: 'application/x-www-form-urlencoded' });
  const json = await toJson<{ upload: string[]; backup: string[] }>(res);
  logger(url, json);
  return json?.upload;
}

export function useFirmList() {
  return useSWR('/api/api/tcm/file/list', fetcher);
}
