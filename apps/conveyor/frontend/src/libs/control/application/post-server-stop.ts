import { SOCKET_NAME } from '!/socket/domain';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { SERVER_TYPE } from '../domain';

const logger = createLogger('control/useServerStop');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: SERVER_TYPE;
  },
) {
  logger(arg, url);
  if (arg === 'HIM') {
    window.send(SOCKET_NAME.MODULE_STOP_HIM);
  } else {
    window.send(SOCKET_NAME.MODULE_STOP_DCM);
  }
}

export function useServerStop() {
  return useSWR('/control/tcm/stop', fetcher);
}
