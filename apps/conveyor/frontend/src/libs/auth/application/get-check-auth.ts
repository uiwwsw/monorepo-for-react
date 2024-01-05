import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { HttpError, http } from '#/http';
const logger = createLogger('users/useCheckAuth');
async function fetcher(url: string) {
  // throw new HttpError('dwd', { status: 403 });
  const res = await http({
    url,
  });
  logger(res, url);
  if (res.ok) return true;
  throw new HttpError('서버 문제 발생', { status: 500 });
  // const res = await fakeApi();
  // logger(res, url);
  // if (res) return true;
}
export function useCheckAuth() {
  return useSWR('/api/users/heartbeat', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  });
}
