import useUpload from '#/useUpload';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useUploadFirm');
export interface Arg {
  file: File;
  address: string;
  port: number;
}
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: Arg;
  },
  onUpload: (url: string, file: File) => Promise<boolean>,
) {
  logger(arg, url);
  const urlObj = new URLSearchParams({
    fileName: arg.file.name,
    address: arg.address,
    port: '',
  }).toString();
  url += '?' + urlObj;
  const res = await onUpload(url, arg.file);
  logger(res, arg.file.name, 1234);
  if (res) return arg.file.name;
  logger(res, 1234);

  return '';
}

export function useUploadFirm() {
  const { process, onUpload } = useUpload();
  const swr = useSWR('/api/api/tcm/file/upload', (url, { arg }: { arg: Arg }) => fetcher(url, { arg }, onUpload));
  return {
    ...swr,
    process,
  };
}
