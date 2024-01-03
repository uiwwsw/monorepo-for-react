import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { ISetSystemEquipValueReq } from '@package-backend/types';

const logger = createLogger('redis/useSetEquipmentValue');

async function fetcher(url: string, { arg }: { arg: ISetSystemEquipValueReq }) {
  const res = await http<ISetSystemEquipValueReq>({ url, arg, method: 'POST' });
  logger(res);
  if (!res.ok) throw new Error('에러 발생');
}
export function useSetEquipmentValue() {
  return useSWR('/api/redis/set-equipment-value', fetcher);
}
