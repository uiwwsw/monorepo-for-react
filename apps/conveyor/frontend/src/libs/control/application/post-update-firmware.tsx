import useSWR from 'swr/mutation';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { ReponseStatus, responseStatus } from '../domain';
const logger = createLogger('tcm/useUpdateFirmware');

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
  const mockDataUpdate: responseStatus = {
    result: ReponseStatus.SUCCESS,
    reason: 'fakeAPI',
  };

  const res = await fakeApi(mockDataUpdate);

  return res;
}

export function useUpdateFirmware() {
  return useSWR('/control/tcm/update', fetcher);
}
