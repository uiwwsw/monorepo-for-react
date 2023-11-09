// import { http } from '@package-frontend/utils';
import useSWR from 'swr';
import { mockDataGraph } from '../domain';
import { createLogger, fakeApi } from '@package-frontend/utils';
const logger = createLogger('alarm/useGetGraph');

async function fetcher(url: string) {
  const res = await fakeApi(mockDataGraph);
  logger(res);
  return res;
  //   return await http({ url });
}

export function useGetAlarmGraph() {
  return useSWR('/get-alarm-graph', fetcher);
}
