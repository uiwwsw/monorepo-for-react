import { SOCKET_NAME } from '!/socket/domain';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useTcmStart');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      address: string;
      port?: number;
    };
  },
) {
  logger(arg, url);
  window.send(SOCKET_NAME.MODULE_START_TCM);
}

export function useTcmStart() {
  return useSWR('/control/tcm/start', fetcher);
}
