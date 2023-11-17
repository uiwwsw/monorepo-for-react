import useSWR from 'swr/mutation';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { mockDataUpdate } from '../domain';
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
  const res = await fakeApi(mockDataUpdate);
  console.log('res', res);

  logger(arg, url);
  return res?.status;
}

export function useUpdateFirmware() {
  return useSWR('/api/deploy/update', fetcher);
}
