import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ReponseStatus, responseStatus } from '../domain';

const logger = createLogger('tcm/useTcmStart');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      tid: number;
      fileName: string;
    };
  },
) {
  logger(arg, url);

  //temporary
  const mockData: responseStatus = {
    result: ReponseStatus.SUCCESS,
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockData);

  return res;
}

export function useTcmBackupDelete() {
  return useSWR('/control/tcm/backup', fetcher);
}
