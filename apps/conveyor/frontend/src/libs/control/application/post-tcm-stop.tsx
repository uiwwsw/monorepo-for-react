import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { Status, DeviceStatus } from '../domain';

const logger = createLogger('tcm/useTcmStop');

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
  const mockData: DeviceStatus = {
    tid: arg.tid,
    status: Status.OFFLINE,
  };

  const res = await fakeApi(mockData);

  return res?.status;
}

export function useTcmStop() {
  return useSWR('/control/tcm/stop', fetcher);
}
