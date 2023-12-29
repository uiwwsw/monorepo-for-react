import { http, toBlob } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
const logger = createLogger('control/useServerLog');
export interface Arg {
  fileName: string;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http({ url, contentType: 'application/x-www-form-urlencoded', param: arg });
  logger(url, res);
  const blob = await toBlob(res);
  return blob;
}

export function useServerLog() {
  return useSWR('/api/api/him/log', fetcher);
}
