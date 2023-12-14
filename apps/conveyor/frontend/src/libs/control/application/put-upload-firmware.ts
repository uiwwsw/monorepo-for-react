import useUpload from '#/useUpload';
import { createLogger } from '@package-frontend/utils';
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
  onUpload: (file: File) => Promise<boolean>,
) {
  logger(arg, url);
  const res = await onUpload(arg.file);
  logger(res, arg.file.name, 1234);
  if (res) return arg.file.name;
  logger(res, 1234);

  return '';
}

export function useUploadFirm() {
  const url = '/api/api/tcm/file/upload';
  const { process, onUpload } = useUpload(url);
  const swr = useSWR(url, (url, { arg }: { arg: Arg }) => fetcher(url, { arg }, onUpload));
  return {
    ...swr,
    process,
  };
}
