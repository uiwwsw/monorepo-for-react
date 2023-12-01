import { createLogger, fakeApi } from '@package-frontend/utils';
import { FileInfo } from '../domain';
import useSWR from 'swr/mutation';
const logger = createLogger('control/useTcmLogList');
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
  const mockDataLogs: FileInfo[] = [
    { fileName: 'log1.txt', fileSize: 1024 },
    { fileName: 'log2.txt', fileSize: 2048 },
    { fileName: 'log3.txt', fileSize: 512 },
    { fileName: 'log4.txt', fileSize: 1024 },
    { fileName: 'log5.txt', fileSize: 2048 },
    { fileName: 'log6.txt', fileSize: 512 },
    { fileName: 'log7.txt', fileSize: 1024 },
    { fileName: 'log8.txt', fileSize: 2048 },
    { fileName: 'log9.txt', fileSize: 512 },
    { fileName: 'log10.txt', fileSize: 1024 },
    { fileName: 'log10.txt', fileSize: 1024 },
    { fileName: 'log12.txt', fileSize: 2048 },
    { fileName: 'log13.txt', fileSize: 512 },
    { fileName: 'log14.txt', fileSize: 1024 },
    { fileName: 'log15.txt', fileSize: 2048 },
    { fileName: 'log16.txt', fileSize: 512 },
  ];

  const res = await fakeApi(mockDataLogs);
  return res;
}

export function useTcmLogList() {
  return useSWR('/control/tcm/log-list', fetcher);
}