import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import { SocketSubscript } from '!/socket/domain';
/* ======   interface   ====== */
export type useSocketProps<K, T> = SocketSubscript<K, T>;
/* ======    global     ====== */
const logger = createLogger('utils/useSocket');
const socket = io(import.meta.env.VITE_SOCKET);
const useSocket = <K, T = unknown>({ strName, trigger }: useSocketProps<K, T>) => {
  /* ======   variables   ====== */
  const [load, setLoad] = useState(false);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect', socket, strName, trigger);
    socket.on(strName, trigger);
  }, [socket, load]);
  return () => setLoad(!load);
};

export default useSocket;
