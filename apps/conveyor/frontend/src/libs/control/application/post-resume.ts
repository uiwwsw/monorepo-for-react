import { createLogger, fakeApi, wait } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('control/useResume');

async function fetcher(url: string) {
  logger(url);

  //temporary
  const mockData = {
    result: 'SUCCESS',
    reason: 'fakeAPI',
  };
  await wait(100000);
  const res = await fakeApi(mockData);

  return res;
}

export function useResume() {
  return useSWR('/control/resume', fetcher);
}
