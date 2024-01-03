import { http, toJson } from '#/http';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { EquipmentValue } from '../domain';
import { IGetSystemEquipValueResp } from '@package-backend/types';

const logger = createLogger('redis/useGetEquipmentValue');
async function fetcher(url: string) {
  const res = await http({ url });
  logger(res);
  const json = await toJson<IGetSystemEquipValueResp>(res);
  logger(json);
  if (json) {
    return new EquipmentValue(json);
  } else {
    return undefined;
  }
}
export function useGetEquipmentValue() {
  return useSWR('/api/redis/get-equipment-value', fetcher);
}
