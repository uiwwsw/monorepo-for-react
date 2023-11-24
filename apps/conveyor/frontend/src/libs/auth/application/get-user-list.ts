import { FORMAT, createLogger, http, newDate } from '@package-frontend/utils';
// import { faker } from '@faker-js/faker';
import useSWR from 'swr';
import { User } from '../domain';
const logger = createLogger('auth/useUserList');

async function fetcher(url: string) {
  const res = await http<{ users: User[] }>({
    url,
  });
  logger(url, res);
  return res!.users.map((x) => {
    const res: User = {
      ...x,
      createdDate: newDate(x.createdDate).format(FORMAT),
      lastAccess: newDate(x.lastAccess).format(FORMAT),
    };

    return res;
  });
}

export function useUserList() {
  return useSWR('/api/users/user-list', fetcher);
}
