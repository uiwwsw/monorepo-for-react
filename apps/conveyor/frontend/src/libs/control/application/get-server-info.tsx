// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { ServerInfo, CONTROL_STATUS } from '../domain';
const logger = createLogger('control/useServerInfo');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockDataServer: ServerInfo[] = [
    {
      sid: 1,
      type: 'dcm',
      status: CONTROL_STATUS.OFFLINE,
      version: '1.0.1',
    },
    {
      sid: 2,
      type: 'him',
      status: CONTROL_STATUS.ONLINE,
      version: '2.2.1',
    },
  ];

  const res = await fakeApi(mockDataServer);
  return res;
}

export function useServerInfo() {
  return useSWR('/control/server/Info', fetcher);
}
