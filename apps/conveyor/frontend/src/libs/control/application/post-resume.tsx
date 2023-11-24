import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ReponseResult, ResponseStatus } from '../domain';

const logger = createLogger('/useResume');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockData: ResponseStatus = {
    result: ReponseResult.SUCCESS,
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockData);

  return res;
}

export function useResume() {
  return useSWR('/control/resume', fetcher);
}
