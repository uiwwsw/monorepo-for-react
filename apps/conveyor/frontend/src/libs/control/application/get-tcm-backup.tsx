import { createLogger, fakeApi } from '@package-frontend/utils';
import useSWR from 'swr';
import { FileInfo } from '../domain';

const logger = createLogger('tcm/backup');

async function fetcher(url: string, tid?: number) {
  logger(url, tid);

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

export function useTcmBackup(tid?: number) {
  return useSWR(['/control/tcm/backup', tid], fetcher);
}
