import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { Status, DeviceStatus } from '../domain';

const logger = createLogger('tcm/useTcmReload');

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
    status: Status.ONLINE,
  };

  const res = await fakeApi(mockData);

  return res?.status;
}

export function useTcmReload() {
  return useSWR('/control/tcm/reload', fetcher);
}
