import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */

export type useSocketProps<K> = K;
/* ======    global     ====== */
const logger = createLogger('utils/useSocket');
const socket = io(import.meta.env.VITE_SOCKET);
const useSocket = <K, T = unknown>(name: useSocketProps<K>) => {
  /* ======   variables   ====== */
  const [data, setData] = useState<T>();
  const [reset, setReset] = useState(0);
  // const { strName } = new SocketName(name);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect', socket, name);
    socket.on(`${name}`, setData);
    return () => {
      socket.off(`${name}`, setData);
    };
  }, [socket, reset]);
  return {
    data,
    mutate: () => setReset((prev) => prev + 1),
  };
};

export default useSocket;
