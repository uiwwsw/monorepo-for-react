import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
const logger = createLogger('control/useServerLogList');
async function fetcher(url: string) {
  const res = await http({ url, contentType: 'application/x-www-form-urlencoded' });
  logger(res, url);
  const json = await toJson<{ files: string[] }>(res);
  return json?.files;
}

export function useServerLogList() {
  return useSWR('/api/api/him/log/list', fetcher);
}
