import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useTcmStop');

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
  const mockData = {
    result: 'SUCCESS',
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockData);

  return res;
}

export function useTcmStop() {
  return useSWR('/control/tcm/stop', fetcher);
}
