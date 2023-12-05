// import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
/* ======   interface   ====== */

export type UseSocketProps<K> = K;
/* ======    global     ====== */
const logger = createLogger('utils/useSocket');
const strToParse = <T>(unknown: unknown): T => {
  // 배열인 경우, 배열의 각 요소를 재귀적으로 파싱합니다.
  if (Array.isArray(unknown)) {
    return unknown.map((item) => strToParse(item)) as T;
  }

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
      logger(e);
      // JSON 파싱에 실패한 경우, 원래의 값을 그대로 반환합니다.
      return unknown as T;
    }
  }

  // 배열이나 문자열이 아닌 경우, 원래의 값을 그대로 반환합니다.
  return unknown as T;
};
const useSocket = <K, T = unknown>(type: UseSocketProps<K>) => {
  /* ======   variables   ====== */
  const { data: auth } = useGetAuth();
  if (!auth?.token) return {};
  const webSocketUrl = `ws://192.168.101.14:7080/ws?token=${auth?.token}`;
  const ws = useRef<WebSocket>(new WebSocket(webSocketUrl));
  const [status, setStatus] = useState<'CONNECTING' | 'OPEN' | 'CLOSED'>('CONNECTING');
  const [data, setData] = useState<Record<string, T>>();
  /* ======   function    ====== */
  const mutate = () => ws.current.send(JSON.stringify({ type, compress: 0 }));
  /* ======   useEffect   ====== */
  useEffect(() => {
    ws.current.onopen = () => setStatus('OPEN');
    ws.current.onclose = () => setStatus('CLOSED');
    ws.current.onmessage = (message: MessageEvent<T>) => {
      logger(message);
      setData(message.data as any); // TODO 종상님 테스트 편하기 위한 롤백
      // const data = strToParse(message.data) as { type: string; data: T };
      // setData((prev) => ({
      //   ...prev,
      //   [data.type]: data.data,
      // }));
    };
    // return () => {
    //   if (ws.current.readyState === ws.current.OPEN) ws.current.close();
    // };
  }, []);
  useEffect(() => {
    if (status === 'OPEN') {
      logger('useEffect', status);
      mutate();
    }
  }, [status]);
  return {
    status,
    data,
  };
};

export default useSocket;
