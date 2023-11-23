import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ReponseStatus, responseStatus } from '../domain';

const logger = createLogger('tcm/useTcmKill');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      tid: number;
    };
  },
) {
  logger(arg, url);

  //temporary
  const mockData: responseStatus = {
    result: ReponseStatus.SUCCESS,
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockData);

  return res;
}

export function useTcmKill() {
  return useSWR('/control/tcm/kill', fetcher);
}
