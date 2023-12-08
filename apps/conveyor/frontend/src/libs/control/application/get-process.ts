import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ProcessList } from '../domain';

const logger = createLogger('control/useProcessId');

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

  const res = await http({ url, arg });
  const json = await toJson<ProcessList>(res);
  logger(json);
  return json?.procList[0].procId;
}

export function useProcessId() {
  return useSWR('/api/api/tcm/process/list', fetcher);
}
