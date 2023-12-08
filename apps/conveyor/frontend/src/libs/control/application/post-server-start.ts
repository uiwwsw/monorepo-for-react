import { SOCKET_NAME } from '!/socket/domain';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { SERVER_TYPE } from '../domain';

const logger = createLogger('control/useServerStart');

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
    window.send(SOCKET_NAME.MODULE_START_HIM);
  } else {
    window.send(SOCKET_NAME.MODULE_START_DCM);
  }
}

export function useServerStart() {
  return useSWR('/control/tcm/start', fetcher);
}
