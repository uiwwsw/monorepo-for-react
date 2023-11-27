import useSWR from 'swr';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { TcmInfo } from '../domain';
const logger = createLogger('control/useTcmInfo');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockDataTCM: TcmInfo[] = [
    {
      tid: 101,
      status: 'OFFLINE',
      version: '1.2.1',
      adjTcmConnection: '2/2',
      adjTcmConnectionDetail: [
        { tid: 102, connectionStatus: 'ON' },
        { tid: 103, connectionStatus: 'ON' },
      ],
      Process: ['1131', '1181'],
    },
    {
      tid: 102,
      status: 'ONLINE',
      version: '1.2.1',
      adjTcmConnection: '2/4',
      adjTcmConnectionDetail: [
        { tid: 101, connectionStatus: 'ON' },
        { tid: 103, connectionStatus: 'ON' },
        { tid: 104, connectionStatus: 'OFF' },
        { tid: 105, connectionStatus: 'OFF' },
        { tid: 106, connectionStatus: 'OFF' },
        { tid: 101, connectionStatus: 'ON' },
        { tid: 103, connectionStatus: 'ON' },
        { tid: 104, connectionStatus: 'OFF' },
        { tid: 105, connectionStatus: 'OFF' },
        { tid: 106, connectionStatus: 'OFF' },
        { tid: 101, connectionStatus: 'ON' },
      ],
      Process: ['1131', '1181'],
    },
    {
      tid: 103,
      status: 'ONLINE',
      version: '1.2.1',
      adjTcmConnection: '2/2',
      adjTcmConnectionDetail: [
        { tid: 101, connectionStatus: 'OFF' },
        { tid: 102, connectionStatus: 'OFF' },
      ],
      Process: ['1121', '1181'],
    },
    {
      tid: 104,
      status: 'ONLINE',
      version: '1.2.1',
      adjTcmConnection: '1/1',
      adjTcmConnectionDetail: [{ tid: 102, connectionStatus: 'ON' }],
      Process: ['1131', '2201'],
    },
    {
      tid: 105,
      status: 'ONLINE',
      version: '1.2.1',
      adjTcmConnection: '1/1',
      adjTcmConnectionDetail: [{ tid: 104, connectionStatus: 'OFF' }],
      Process: ['1131', '2201'],
    },
    {
      tid: 106,
      status: 'ONLINE',
      version: '1.2.1',
      adjTcmConnection: '1/1',
      adjTcmConnectionDetail: [{ tid: 104, connectionStatus: 'ON' }],
      Process: ['1131', '2201'],
    },
  ];
  const res = await fakeApi(mockDataTCM);
  return res;
}

export function useTcmInfo() {
  return useSWR('/control/tcm/Info', fetcher);
}
