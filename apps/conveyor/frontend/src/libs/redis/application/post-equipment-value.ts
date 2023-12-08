import { http } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';

const logger = createLogger('redis/useUpdateEquipmentValue');
export interface Arg {
  target: string;
  value: string;
}
async function fetcher(url: string, { arg }: { arg: Arg }) {
  const res = await http<Arg>({ url, arg, method: 'POST' });
  logger(res);
  if (res.ok) return true;
  return false;
}

export function useUpdateEquipmentValue() {
  return useSWR('/api/redis/set-equipment-value', fetcher);
}
