import useSWR from 'swr/mutation';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { UploadFile } from '../domain';
const logger = createLogger('tcm/useUploadFirmware');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      file: File;
    };
  },
) {
  const formData = new FormData();
  formData.append('file', arg.file);

  //temporary
  const uploadFile: UploadFile = {
    name: arg.file.name,
    size: arg.file.size,
    type: arg.file.type,
  };

  const res = await fakeApi(uploadFile);

  logger(arg, url);
  return res;
}

export function useUploadFirmware() {
  return useSWR('/api/deploy/upload', fetcher);
}
