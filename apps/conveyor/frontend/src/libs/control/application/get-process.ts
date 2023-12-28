import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

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

  const res = await http({ url, param: arg });
  const json = await toJson<{ ProcList: { ProcId: number; ProcName: 'tcm' }[] }>(res);
  logger(json);
  return json?.ProcList[0].ProcId;
}
// 0
// :
// {ProcId: 607, ProcName: "tcm"}
export function useProcessId() {
  return useSWR('/api/api/tcm/process/list', fetcher);
}
