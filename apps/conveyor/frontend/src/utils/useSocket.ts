// import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
/* ======   interface   ====== */

export type UseSocketProps<K> = K;
/* ======    global     ====== */
const logger = createLogger('utils/useSocket');
const useSocket = <K, T = unknown>(type: UseSocketProps<K>) => {
  /* ======   variables   ====== */
  const { data: auth } = useGetAuth();
  if (!auth?.token) return {};
  const webSocketUrl = `ws://192.168.101.14:7080/ws?token=${auth?.token}`;
  const ws = useRef<WebSocket>(new WebSocket(webSocketUrl));
  const [status, setStatus] = useState<'CONNECTING' | 'OPEN' | 'CLOSED'>('CONNECTING');
  const [data, setData] = useState<T>();
  /* ======   function    ====== */
  const mutate = () => ws.current.send(JSON.stringify({ type, compress: 0 }));
  /* ======   useEffect   ====== */
  useEffect(() => {
    ws.current.onopen = () => {
      setStatus('OPEN');
    };
    ws.current.onclose = () => setStatus('CLOSED');
    ws.current.onmessage = (message: MessageEvent<T>) => {
      logger(message);
      setData(message.data);
    };
    // return () => {
    //   if (ws.current.readyState === ws.current.OPEN) ws.current.close();
    // };
  }, []);
  useEffect(() => {
    if (status === 'OPEN') {
      logger(status);
      mutate();
    }
  }, [status]);
  return {
    status,
    data,
  };
};

export default useSocket;
