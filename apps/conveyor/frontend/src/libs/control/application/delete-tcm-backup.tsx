import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ResponseResult, ResponseStatus } from '../domain';

const logger = createLogger('control/useTcmBackupDelete');

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
  const mockData: ResponseStatus = {
    result: ResponseResult.SUCCESS,
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockData);

  return res;
}

export function useTcmBackupDelete() {
  return useSWR('/control/tcm/backup', fetcher);
}