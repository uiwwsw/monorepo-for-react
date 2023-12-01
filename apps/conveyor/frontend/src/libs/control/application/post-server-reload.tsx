import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useServerReload');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      sid: number;
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

export function useServerReload() {
  return useSWR('/control/server/reload', fetcher);
}