import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { http, toJson } from '#/http';
const logger = createLogger('test/useTest');
async function fetcher(url: string) {
  const res = await http({
    url,
  });
  logger(res, url);
  const json = await toJson(res);
  return json;
}
export function useTest() {
  return useSWR('/api/users/user-list', fetcher);
}
