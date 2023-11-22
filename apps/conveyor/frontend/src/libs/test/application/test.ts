import { createLogger, http } from '@package-frontend/utils';
// import { faker } from '@faker-js/faker';
import useSWR from 'swr';
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
