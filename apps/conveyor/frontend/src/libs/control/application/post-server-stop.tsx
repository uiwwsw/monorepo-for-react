import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { RESPONSE_RESULT, ResponseStatus } from '../domain';

const logger = createLogger('control/useServerStop');

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
  const mockData: ResponseStatus = {
    result: RESPONSE_RESULT.SUCCESS,
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockData);

  return res;
}

export function useServerStop() {
  return useSWR('/control/server/stop', fetcher);
}
