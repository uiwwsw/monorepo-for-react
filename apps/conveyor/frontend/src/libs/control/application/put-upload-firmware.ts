import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useUploadFirm');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      file: File;
      // address: string;
      // port: number;
    };
  },
) {
  logger(arg, url);

  const res = await http({
    url,
    file: arg.file,
    // arg: {
    //   fileName: arg.file.name,
    //   address: arg.address,
    //   port: arg.port,
    // },
    method: 'PUT',
  });
  const json = await toJson<{ fileName: string }>(res);
  return json?.fileName;
}

export function useUploadFirm() {
  return useSWR('/api/api/tcm/file/upload', fetcher);
}
