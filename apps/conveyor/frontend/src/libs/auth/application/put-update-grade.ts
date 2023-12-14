// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger } from '@package-frontend/utils';
import { http, toJson } from '#/http';
import { UserEditGradeRequest, UserGrade } from '@package-backend/types';

const logger = createLogger('auth/useUpdateGrade');

async function fetcher(
  url: string,
  {
    arg: { grade, id },
  }: {
    arg: {
      id: string;
      grade: UserGrade;
    };
  },
) {
  const res = await http<UserEditGradeRequest>({
    url,
    method: 'PUT',
    arg: {
      user_id: id,
      grade,
    },
  });
  logger(res);
  await toJson(res);
  return true;
}

export function useUpdateGrade() {
  return useSWR('/api/users/user-edit', fetcher);
}
