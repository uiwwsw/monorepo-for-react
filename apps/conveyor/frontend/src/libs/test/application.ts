import { http } from '@package-frontend/utils';
import { GetUserRequest, GetUserResponse, STResponseFailed, STResponseSuccess } from '@package-backend/types';
import useSWR from 'swr';

async function fetcher(
  url: string,
  // {
  //   arg,
  // }: {
  //   arg: GetUserRequest;
  // },
) {
  // await new Promise((res) => setTimeout(res, 5000));
  // return {
  //   test: '1234',
  // };
  return http<{ name: string }>(url);
}

export function useTest(arg: GetUserRequest) {
  return useSWR<STResponseSuccess<GetUserResponse>, STResponseFailed>('/api/user/', (url) => fetcher(url + arg.id));
}
