import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { http } from '#/http';
const logger = createLogger('users/useHeartBeat');
async function fetcher(url: string) {
  const res = await http({
    url,
  });
  logger(res, url);
  return res.ok;
}
export function useHeartBeat() {
  return useSWR('/api/users/heartbeat', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
  });
}
