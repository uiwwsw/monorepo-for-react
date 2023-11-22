import useSWR from 'swr/mutation';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { UpdateStatus, firmwareStatus } from '../domain';
const logger = createLogger('tcm/useUpdateFirmware');

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
  const mockDataUpdate: firmwareStatus = {
    status: UpdateStatus.Completed,
  };

  const res = await fakeApi(mockDataUpdate);

  return res?.status;
}

export function useUpdateFirmware() {
  return useSWR('/control/tcm/update', fetcher);
}
