// import io from 'socket.io-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
import { SOCKET_MESSAGE, SOCKET_NAME } from '!/socket/domain';
import { useDebounce } from '@library-frontend/ui';
/* ======   interface   ====== */
export const enum STATUS {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}
/* ======    global     ====== */
const logger = createLogger('utils/useSocket');
const strToParse = <T>(unknown: unknown): T => {
  // 배열인 경우, 배열의 각 요소를 재귀적으로 파싱합니다.
  if (Array.isArray(unknown)) return unknown.map((item) => strToParse(item)) as T;

  // 문자열인 경우 JSON으로 파싱을 시도합니다.
  if (typeof unknown === 'string') {
    try {
      const obj = JSON.parse(unknown);
      // 파싱된 객체의 각 키에 대해 재귀적으로 파싱을 진행합니다.
      return Object.keys(obj).reduce((acc: any, key) => {
        acc[key] = strToParse(obj[key]);
        return acc;
      }, {} as T);
    } catch (e) {
      // JSON 파싱에 실패한 경우, 원래의 값을 그대로 반환합니다.
      return unknown as T;
    }
  }

  // 배열이나 문자열이 아닌 경우, 원래의 값을 그대로 반환합니다.
  return unknown as T;
};
const useSocket = <T = unknown>(type: SOCKET_NAME) => {
  /* ======   variables   ====== */
  const { data: auth } = useGetAuth();
  const webSocketUrl = `ws://192.168.101.14:7080/ws?token=${auth?.token}`;
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<STATUS>(ws.current?.readyState ?? STATUS['CONNECTING']);
  const [data, setData] = useState<Record<string, any>>();
  const initialModuleState = useMemo(() => data?.[SOCKET_MESSAGE.INITIAL_MODULE_STATE], [data]);
  // const initialModuleState = useMemo(() => data?.[SOCKET_MESSAGE.INITIAL_MODULE_STATE], [data]);
  /* ======   function    ====== */
  const mutate = () => ws.current?.send(JSON.stringify({ type, compress: 0 }));
  const debounceMutate = useDebounce<void>(mutate);
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (status === STATUS.OPEN) debounceMutate();

    if (ws.current) return;
    logger('useEffect init');

    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => setStatus(STATUS.OPEN);
    ws.current.onclose = () => {
      ws.current = null;
      setStatus(STATUS.CLOSED);
    };
    ws.current.onmessage = (message: MessageEvent<T>) => {
      logger(message);
      const data = strToParse(message.data) as { type: string; data: T };
      setData((prev) => ({
        ...prev,
        [data.type]: data.data,
      }));
    };
    // return () => {
    //   logger('clear', ws.current.readyState === ws.current.OPEN);
    //   if (ws.current.readyState === ws.current.OPEN) ws.current.close();
    // };
  }, [auth?.token, status]);

  return {
    data,
    initialModuleState,
  };
};

export default useSocket;
