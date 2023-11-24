import { createLogger, fakeApi } from '@package-frontend/utils';
import { FileInfo } from '../domain';
import useSWR from 'swr';
const logger = createLogger('server/logList');

async function fetcher(url: string, sid?: number) {
  logger(url, sid);

  //temporary
  const mockDataLogs: FileInfo[] = [
    { fileName: 'server_log1.txt', fileSize: 1024 },
    { fileName: 'server_log2.txt', fileSize: 2048 },
    { fileName: 'server_log3.txt', fileSize: 512 },
    { fileName: 'server_log4.txt', fileSize: 1024 },
    { fileName: 'server_log5.txt', fileSize: 2048 },
    { fileName: 'server_log6.txt', fileSize: 512 },
    { fileName: 'server_log7.txt', fileSize: 1024 },
  ];

  const res = await fakeApi(mockDataLogs);
  return res;
}

export function useServerLogList(tid?: number) {
  return useSWR(['/control/server/loglist', tid], fetcher);
}
