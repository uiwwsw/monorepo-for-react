import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ReponseStatus, responseStatus } from '../domain';

const logger = createLogger('/usePause');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockData: responseStatus = {
    result: ReponseStatus.SUCCESS,
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockData);

  return res;
}

export function usePause() {
  return useSWR('/control/pause', fetcher);
}
