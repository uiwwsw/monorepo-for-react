import useSWR from 'swr';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { CONTROL_STATUS, TCM_CONNECTION_STATUS, TcmInfo } from '../domain';
const logger = createLogger('control/useTcmInfo');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockDataTCM: TcmInfo[] = [
    {
      tid: 101,
      status: CONTROL_STATUS.ONLINE,
      version: '1.2.1',
      adjTcmConnection: '2/2',
      adjTcmConnectionDetail: [
        { tid: 102, cStatus: TCM_CONNECTION_STATUS.ON },
        { tid: 103, cStatus: TCM_CONNECTION_STATUS.ON },
      ],
      Process: ['1131', '1181'],
    },
    {
      tid: 102,
      status: CONTROL_STATUS.ONLINE,
      version: '1.2.1',
      adjTcmConnection: '2/4',
      adjTcmConnectionDetail: [
        { tid: 101, cStatus: TCM_CONNECTION_STATUS.ON },
        { tid: 103, cStatus: TCM_CONNECTION_STATUS.ON },
        { tid: 104, cStatus: TCM_CONNECTION_STATUS.OFF },
        { tid: 105, cStatus: TCM_CONNECTION_STATUS.OFF },
        { tid: 106, cStatus: TCM_CONNECTION_STATUS.OFF },
        { tid: 101, cStatus: TCM_CONNECTION_STATUS.ON },
        { tid: 103, cStatus: TCM_CONNECTION_STATUS.ON },
        { tid: 104, cStatus: TCM_CONNECTION_STATUS.OFF },
        { tid: 105, cStatus: TCM_CONNECTION_STATUS.OFF },
        { tid: 106, cStatus: TCM_CONNECTION_STATUS.OFF },
        { tid: 101, cStatus: TCM_CONNECTION_STATUS.ON },
      ],
      Process: ['1131', '1181'],
    },
    {
      tid: 103,
      status: CONTROL_STATUS.ONLINE,
      version: '1.2.1',
      adjTcmConnection: '2/2',
      adjTcmConnectionDetail: [
        { tid: 101, cStatus: TCM_CONNECTION_STATUS.ON },
        { tid: 102, cStatus: TCM_CONNECTION_STATUS.ON },
      ],
      Process: ['1121', '1181'],
    },
    {
      tid: 104,
      status: CONTROL_STATUS.OFFLINE,
      version: '1.2.1',
      adjTcmConnection: '1/1',
      adjTcmConnectionDetail: [{ tid: 102, cStatus: TCM_CONNECTION_STATUS.ON }],
      Process: ['1131', '2201'],
    },
    {
      tid: 105,
      status: CONTROL_STATUS.OFFLINE,
      version: '1.2.1',
      adjTcmConnection: '1/1',
      adjTcmConnectionDetail: [{ tid: 104, cStatus: TCM_CONNECTION_STATUS.ON }],
      Process: ['1131', '2201'],
    },
    {
      tid: 106,
      status: CONTROL_STATUS.OFFLINE,
      version: '1.2.1',
      adjTcmConnection: '1/1',
      adjTcmConnectionDetail: [{ tid: 104, cStatus: TCM_CONNECTION_STATUS.ON }],
      Process: ['1131', '2201'],
    },
  ];
  const res = await fakeApi(mockDataTCM);
  return res;
}

export function useTcmInfo() {
  return useSWR('/control/tcm/Info', fetcher);
}
