import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
import { User } from '../domain';
import { http, toJson } from '#/http';
import { UserGrade } from '@package-backend/types';
const logger = createLogger('auth/useUserList');

async function fetcher(url: string) {
  const res = await http({
    url,
  });
  logger(url, res);
  const json = await toJson<{ users: User[] }>(res);
  return json!.users.map((x) => {
    const res = {
      ...x,
      gradeName: UserGrade[x.grade],
    };
    return res;
  });
}

export function useUserList() {
  return useSWR('/api/users/user-list', fetcher);
}
