import { createLogger } from '#/logger';
// import { faker } from '@faker-js/faker';
import useSWR from 'swr';
import { User } from '../domain';
import { http } from '#/http';
import { UserGrade } from '@package-backend/types';
const logger = createLogger('auth/useUserList');

async function fetcher(url: string) {
  const res = await http<{ users: User[] }>({
    url,
  });
  logger(url, res);
  return res!.users.map((x) => {
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
