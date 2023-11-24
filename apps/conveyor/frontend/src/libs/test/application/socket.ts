import io from 'socket.io-client';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
const logger = createLogger('test/useTest');
const socket = io(import.meta.env.VITE_SOCKET);
async function fetcher<T>(url: string) {
  let resolve: any;
  const trigger = new Promise((res) => (resolve = res));
  socket.on(url, trigger);
  logger(url, data);
  return data;
}

export function useTest() {
  return useSWR('/api/users/user-list', fetcher);
}
