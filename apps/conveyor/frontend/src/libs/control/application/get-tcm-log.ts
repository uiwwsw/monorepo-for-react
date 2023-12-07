import { http, toBlob } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { Arg as TcmListLogArg } from './get-tcm-log-list';
import { Arg as ServerLogArg } from './get-server-log';
const logger = createLogger('control/useTcmLog');
async function fetcher(url: string, { arg }: { arg: TcmListLogArg & ServerLogArg }) {
  const res = await http({ url, contentType: 'application/x-www-form-urlencoded', arg });
  logger(url, res);
  const blob = await toBlob(res);
  return blob;
}

export function useTcmLog() {
  return useSWR('/api/api/tcm/log', fetcher);
}
