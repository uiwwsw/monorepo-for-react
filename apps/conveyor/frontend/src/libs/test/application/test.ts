import { createLogger } from '#/logger';
import useSWR from 'swr';
import { http } from '#/http';
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
