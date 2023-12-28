import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useDeleteFirm');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      fileName: string;
      address: string;
      port: number;
    };
  },
) {
  logger(arg, url);

  await http({
    url,
    param: {
      ...arg,
      upload: 1,
    },
    method: 'POST',
  });
  return true;
}

export function useDeleteFirm() {
  return useSWR('/api/api/tcm/file/delete', fetcher);
}
