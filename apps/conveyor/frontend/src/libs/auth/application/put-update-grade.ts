// import { http } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import { createLogger, http } from '@package-frontend/utils';

const logger = createLogger('auth/useUpdateGrade');

async function fetcher(
  url: string,
  {
    arg: { grade, id },
  }: {
    arg: {
      id: string;
      grade: number;
    };
  },
) {
  const res = await http({
    url,
    method: 'PUT',
    arg: {
      user_id: id,
      grade,
    },
  });
  logger(res);

  return res;
}

export function useUpdateGrade() {
  return useSWR('/api/users/user-edit', fetcher);
}
