import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useDeleteBackup');

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

  const res = await http({
    url,
    arg: {
      ...arg,
      upload: 0,
    },
    method: 'POST',
  });
  if (res.ok) return true;
  throw new Error('성공하지 못함');
}

export function useDeleteBackup() {
  return useSWR('/api/api/tcm/file/delete', fetcher);
}
