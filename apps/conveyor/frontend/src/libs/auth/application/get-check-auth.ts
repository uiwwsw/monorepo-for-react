import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { http } from '#/http';
const logger = createLogger('users/useCheckAuth');
async function fetcher(url: string) {
  const res = await http({
    url,
  });
  logger(res);
  return res.ok;
  // const res = await fakeApi();
  // logger(res, url);
  // if (res) return true;
}
export function useCheckAuth() {
  return useSWR('/api/users/heartbeat', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
  });
}
