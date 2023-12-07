import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useTcmKill');

async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      address: string;
      procId: number;
      port: number;
    };
  },
) {
  logger(arg, url);

  const res = await http({ url, arg, method: 'POST' });
  const json = await toJson(res);
  return json;
}

export function useTcmKill() {
  return useSWR('/api/api/tcm/process/kill', fetcher);
}
