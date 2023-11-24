import { createLogger } from '@package-frontend/utils';
// import { faker } from '@faker-js/faker';
import useSWR from 'swr';
import { User } from '../domain';
import { http } from '#/http';
const logger = createLogger('auth/useUserList');

async function fetcher(url: string) {
  const res = await http<{ users: User[] }>({
    url,
  });
  logger(url, res);
  return res!.users.map((x) => {
    const res: User = {
      ...x,
    };
    return res;
  });
}

export function useUserList() {
  return useSWR('/api/users/user-list', fetcher);
}
