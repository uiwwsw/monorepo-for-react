import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { Status, deviceStatus } from '../domain';

const logger = createLogger('tcm/useTcmRestart');

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
  const mockData: deviceStatus = {
    tid: arg.tid,
    status: Status.ONLINE,
  };

  const res = await fakeApi(mockData);

  return res?.status;
}

export function useTcmRestart() {
  return useSWR('/control/tcm/restart', fetcher);
}
