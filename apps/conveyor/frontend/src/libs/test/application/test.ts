import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { http } from '#/ondhttp';
const logger = createLogger('test/useTest');
async function fetcher(url: string) {
  const res = await http({
    url,
  });
  logger(url, res);
  return res;
}
export function useTest() {
  return useSWR('/api/users/user-list', fetcher);
}
