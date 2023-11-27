// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { ServerInfo } from '../domain';
const logger = createLogger('control/useServerInfo');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockDataServer: ServerInfo[] = [
    {
      sid: 1,
      type: 'DCM',
      status: 'OFFLINE',
      version: '1.0.1',
    },
    {
      sid: 2,
      type: 'HIM',
      status: 'ONLINE',
      version: '2.2.1',
    },
  ];

  const res = await fakeApi(mockDataServer);
  return res;
}

export function useServerInfo() {
  return useSWR('/control/server/Info', fetcher);
}
