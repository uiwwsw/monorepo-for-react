import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { http } from '#/http';
const logger = createLogger('users/useCheckAuth');
async function fetcher(url: string) {
  // throw new HttpError('dwd', { status: 403 });
  const res = await http({
    url,
  });
  logger(res, url);
  return res.ok;
}
export function useCheckAuth() {
  return useSWR('/api/users/heartbeat', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
  });
}
