import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { HttpError, http } from '#/http';
const logger = createLogger('server/useGetHealth');
async function fetcher() {
  logger('server/useGetHealth');
  const res = await http({
    url: '/api/users/heartbeat',
    autoCatch: false,
  });
  logger(res);
  if (res.status !== 200 && !HttpError.unAuth(res.status))
    throw new HttpError('헬스 체크 api 작동 안함', { status: 500 });
  return true;
}
export function useGetHealth() {
  return useSWR('/api/health', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
  });
}
