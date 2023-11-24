import io from 'socket.io-client';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
const logger = createLogger('test/useTest');
const socket = io(import.meta.env.VITE_SOCKET);
async function fetcher<T>(url: string) {
  let resolve = (_: T) => {};
  const promise = new Promise<T>((res) => (resolve = res));
  socket.on(url, resolve);
  return promise;
}

export function useTest() {
  return useSWR('/api/users/user-list', fetcher);
}
