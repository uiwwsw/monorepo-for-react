// import io from 'socket.io-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createLogger, toData } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
import { ModuleState, SOCKET_NAME, SocketData, TcmInfo } from '!/socket/domain';
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
  logger(unknown, typeof unknown);
  if (Array.isArray(unknown)) return unknown.map((item) => strToParse(item)) as T;
  if (!isNaN(Number(unknown))) return Number(unknown) as T;
  try {
    const obj = JSON.parse(unknown as string);
    // 파싱된 객체의 각 키에 대해 재귀적으로 파싱을 진행합니다.
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[key] = strToParse(obj[key]);
      return acc;
    }, {} as T);
  } catch (e) {
    // JSON 파싱에 실패한 경우, 원래의 값을 그대로 반환합니다.
    return unknown as T;
  }
};
const useSocket = <T = unknown>(type: SOCKET_NAME) => {
  /* ======   variables   ====== */
  const { data: auth } = useGetAuth();
  const webSocketUrl = `ws://192.168.101.14:7080/ws?token=${auth?.token}`;
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<STATUS>(ws.current?.readyState ?? STATUS['CONNECTING']);
  const [data, setData] = useState<SocketData[]>([]);
  const moduleState: Map<string, ModuleState> = useMemo(
    () =>
      data.reduce((a, v) => {
        if (v.type === 'initialmodulestate') {
          const data = toData(v.data) as ModuleState;
          a.set(`${data.id ?? data.stateType}`, data);
        }
        return a;
      }, new Map()),
    [data],
  );
  const tcmInfo: Map<string, TcmInfo> = useMemo(
    () =>
      data.reduce((a, v) => {
        if (v.type === 'TCMInfo') {
          const data = toData(v.data) as TcmInfo;
          a.set(`${data.tcmId}`, data);
        }
        return a;
      }, new Map()),
    [data],
  );
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
      setData((prev) => [...prev, strToParse(message.data)]);
    };
    // return () => {
    //   logger('clear', ws.current.readyState === ws.current.OPEN);
    //   if (ws.current.readyState === ws.current.OPEN) ws.current.close();
    // };
  }, [auth?.token, status]);

  return {
    data,
    tcmInfo,
    moduleState,
  };
};

export default useSocket;
