import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { HttpError, http } from '#/http';
const logger = createLogger('server/useGetHealth');
async function fetcher(url: string) {
  const res = await http({
    url,
    autoCatch: false,
  });
  logger(res);
  if (res.status === 505) throw new HttpError('서버', { status: 505 });
  throw new HttpError('서버', { status: 505 });
  return true;
}
export function useGetHealth() {
  return useSWR('/api/users/heartbeat', fetcher);
}
