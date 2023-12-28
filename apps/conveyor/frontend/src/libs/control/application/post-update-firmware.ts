import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useUpdateFirm');

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
    param: arg,
    method: 'POST',
  });
  logger(res);
  if (res.ok) return true;
  throw new Error('성공하지 못함');
}

export function useUpdateFirm() {
  return useSWR('/api/api/tcm/file/update', fetcher);
}
