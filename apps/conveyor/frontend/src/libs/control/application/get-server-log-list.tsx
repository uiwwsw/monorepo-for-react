import { createLogger, fakeApi } from '@package-frontend/utils';
import { FileInfo } from '../domain';
import useSWR from 'swr/mutation'; // TODO mutation 으로 변경, 화면 전체 로딩이 발생함.
const logger = createLogger('control/useServerLogList');
export interface Args {
  sid?: number;
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

export function useServerLogList() {
  return useSWR('/control/server/log-list', fetcher);
}
