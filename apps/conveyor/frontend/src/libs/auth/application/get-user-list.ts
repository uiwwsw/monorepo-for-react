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
  return res?.users.map((x) => ({
    ...x,
    created_date: newDate(x.created_date).format(FORMAT),
    last_access: newDate(x.last_access).format(FORMAT),
  }));
}

export function useUserList() {
  return useSWR('/api/users/user-list', fetcher);
}
