import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { User } from '../domain';
import { http, toJson } from '#/http';
import { UserListResponse } from '@package-backend/types';
const logger = createLogger('auth/useUserList');

async function fetcher(url: string) {
  const res = await http({
    url,
  });
  logger(url, res);
  const json = await toJson<UserListResponse>(res);
  return json!.users.map((x) => new User(x));
}

export function useUserList() {
  return useSWR('/api/users/user-list', fetcher);
}
