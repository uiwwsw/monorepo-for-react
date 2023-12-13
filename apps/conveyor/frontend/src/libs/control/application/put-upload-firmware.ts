import { http, toJson } from '#/http';
import useUpload from '#/useUpload';
import { createLogger, wait } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useUploadFirm');
export interface Arg {
  file: File;
}
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: Arg;
  },
  process: number,
  trigger: (file: File) => void,
) {
  logger(arg, url);
  trigger(arg.file);
  setTimeout(() => {
    throw new Error('타임 아웃 에러');
  }, 30000);
  while (true) {
    await wait(500);
    logger(process);
    if (process >= 100) break;
  }
  return arg.file.name;
}

export function useUploadFirm() {
  const url = '/api/api/tcm/file/upload';
  const { process, onUpload } = useUpload(url);
  const swr = useSWR(url, (url, { arg }: { arg: Arg }) => fetcher(url, { arg }, process, onUpload));
  return {
    ...swr,
    process,
  };
}
