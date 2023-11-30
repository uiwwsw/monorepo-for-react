import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { FileInfo } from '../domain';

const logger = createLogger('control/useTcmBackup');
export interface Args {
  tid?: number;
}
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: Args;
  },
) {
  logger(url, arg);

  //temporary
  const mockDataBackup: FileInfo[] = [
    { fileName: 'backup1.txt', fileSize: 1024 },
    { fileName: 'backup2.txt', fileSize: 2048 },
    { fileName: 'backup3.txt', fileSize: 512 },
    { fileName: 'backup4.txt', fileSize: 1024 },
    { fileName: 'backup5.txt', fileSize: 2048 },
    { fileName: 'backup6.txt', fileSize: 512 },
    { fileName: 'backup7.txt', fileSize: 1024 },
    { fileName: 'backup8.txt', fileSize: 2048 },
  ];

  const res = await fakeApi(mockDataBackup);
  return res;
}

export function useTcmBackup() {
  return useSWR('/control/tcm/backup', fetcher);
}
