import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { EquipmentValue } from '../domain';

const logger = createLogger('redis/useEquipmentValue');

async function fetcher(url: string) {
  const res = await http({ url });
  logger(res);
  const json = await toJson<EquipmentValue>(res);

  return json;
}

export function useEquipmentValue() {
  return useSWR('/api/redis/get-equipment-value', fetcher);
}
