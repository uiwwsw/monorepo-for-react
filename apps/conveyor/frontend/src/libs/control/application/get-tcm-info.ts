// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { ConnectionStatus, Status, TCMInfo } from '../domain';
const logger = createLogger('tcm/useTcmInfo');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockDataTCM: TCMInfo[] = [
    {
      tid: 101,
      status: Status.ONLINE,
      version: '1.2.1',
      AdjTCMConnection: [
        { tid: 102, cstatus: ConnectionStatus.ON },
        { tid: 103, cstatus: ConnectionStatus.ON },
      ],
      Process: ['1131', '1181'],
    },
    {
      tid: 102,
      status: Status.ONLINE,
      version: '1.2.1',
      AdjTCMConnection: [
        { tid: 101, cstatus: ConnectionStatus.ON },
        { tid: 103, cstatus: ConnectionStatus.ON },
        { tid: 104, cstatus: ConnectionStatus.OFF },
        { tid: 105, cstatus: ConnectionStatus.OFF },
        { tid: 106, cstatus: ConnectionStatus.OFF },
      ],
      Process: ['1131', '1181'],
    },
    {
      tid: 103,
      status: Status.ONLINE,
      version: '1.2.1',
      AdjTCMConnection: [
        { tid: 101, cstatus: ConnectionStatus.ON },
        { tid: 102, cstatus: ConnectionStatus.ON },
      ],
      Process: ['1121', '1181'],
    },
    {
      tid: 104,
      status: Status.OFFLINE,
      version: '1.2.1',
      AdjTCMConnection: [{ tid: 102, cstatus: ConnectionStatus.ON }],
      Process: ['1131', '2201'],
    },
    {
      tid: 105,
      status: Status.OFFLINE,
      version: '1.2.1',
      AdjTCMConnection: [{ tid: 104, cstatus: ConnectionStatus.ON }],
      Process: ['1131', '2201'],
    },
    {
      tid: 106,
      status: Status.OFFLINE,
      version: '1.2.1',
      AdjTCMConnection: [{ tid: 104, cstatus: ConnectionStatus.ON }],
      Process: ['1131', '2201'],
    },
  ];
  const res = await fakeApi(mockDataTCM);
  return res;
}

export function useTcmInfo() {
  return useSWR('/tcmInfo', fetcher);
}
