import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useTcmReboot');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      address: string;
      port: number;
    };
  },
) {
  logger(arg, url);

  const res = await http({ url, param: arg });
  return res.ok;
}

export function useTcmReboot() {
  return useSWR('/api/api/tcm/process/reboot', fetcher);
}
