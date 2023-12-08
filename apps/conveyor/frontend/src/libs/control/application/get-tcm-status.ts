import { http, toBlob, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
const logger = createLogger('control/useTcmStatus');
async function fetcher(
  url: string,
  {
    arg,
  }: {
    arg: {
      tcmId: number;
    };
  },
) {
  const res = await http({ url, arg });
  logger(url, res);
  const json = await toJson(res);
  logger(json);
  return json;
}

export function useTcmStatus() {
  return useSWR('/api/api/checktcmclient', fetcher);
}
