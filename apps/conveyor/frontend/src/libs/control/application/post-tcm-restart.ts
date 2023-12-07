import { SOCKET_NAME } from '!/socket/domain';
import { ControlModuleReq } from '@package-backend/types';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useTcmReStart');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: ControlModuleReq;
  },
) {
  logger(arg, url);
  window.send(SOCKET_NAME.MODULE_RESTART_TCM, arg);
}

export function useTcmReStart() {
  return useSWR('/control/tcm/restart', fetcher);
}
