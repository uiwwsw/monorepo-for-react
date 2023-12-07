// import io from 'socket.io-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createLogger, toFormat } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
import { Alarm, ModuleState, SOCKET_MESSAGE, SOCKET_NAME, SocketData, TcmInfo } from '!/socket/domain';
import { useDebounce } from '@library-frontend/ui';
import { CONTROL_STATUS, SERVER_TYPE, ServerList, TcmList } from '!/control/domain';
import { TITAN_INTERNAL_EVENT_ID } from '!/alarm/domain';
import { ContextProps, WS_STATUS } from '@/SocketDataContext';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('utils/useSocket');
const strToParse = <T>(unknown: unknown): T => {
  // 배열인 경우, 배열의 각 요소를 재귀적으로 파싱합니다.
  logger(unknown, typeof unknown);
  if (Array.isArray(unknown)) return unknown.map((item) => strToParse(item)) as T;
  if (!isNaN(Number(unknown))) return unknown as T;
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
const webSocketUrl = (token: string) => `${process.env.WS_API}/ws?token=${token}`;
const useSocket = (type: SOCKET_NAME): ContextProps => {
  /* ======   variables   ====== */
  const { data: auth } = useGetAuth();
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WS_STATUS>(ws.current?.readyState ?? WS_STATUS['CONNECTING']);
  const [data, setData] = useState<SocketData<unknown>[]>([]);
  const [alarm, setAlarm] = useState<Alarm<TITAN_INTERNAL_EVENT_ID>[]>([]);
  const moduleState: Map<string, ModuleState> = useMemo(
    () =>
      data
        .filter((x) => x.type === SOCKET_MESSAGE.INITIAL_MODULE_STATE)
        .reduce((a, v) => {
          const data = toFormat(v.data) as ModuleState;
          a.set(`${data.id ?? data.stateType}`, data);
          return a;
        }, new Map()),
    [data],
  );
  // const tcsEventSet: Map<string, TcsEvent> = useMemo(
  //   () =>
  //     data
  //       .filter((x) => x.type === SOCKET_MESSAGE.TCM_EVENT_SET)
  //       .reduce((a, v) => {
  //         const data = toFormat(v.data) as TcsEvent;
  //         a.set(`${data.location}`, data.eventCode);
  //         return a;
  //       }, new Map()),
  //   [data],
  // );
  const tcmInfo: Map<string, TcmInfo> = useMemo(
    () =>
      data
        .filter((x) => x.type === SOCKET_MESSAGE.TCM_INFO)
        .reduce((a, v) => {
          const data = toFormat(v.data) as TcmInfo;
          a.set(`${data.tcmId}`, data);
          return a;
        }, new Map()),
    [data],
  );
  const tcmList: TcmList[] = useMemo(
    () =>
      Array.from(tcmInfo).map(([id, x]) => ({
        ...x,
        status: CONTROL_STATUS[moduleState.get(id)?.alive ?? 0] as keyof typeof CONTROL_STATUS,
      })),
    [moduleState, tcmInfo],
  );
  const serverList: ServerList[] = useMemo(() => {
    const servers = Array.from(moduleState)
      .filter(([_, x]) => ['HIM', 'DCM'].includes(x.stateType))
      .reverse()
      .map(([id, x]) => ({
        ...x,
        stateType: x.stateType as SERVER_TYPE,
        status: CONTROL_STATUS[moduleState.get(id)?.alive ?? 0] as keyof typeof CONTROL_STATUS,
      }));
    return [servers.find((x) => x.stateType === 'HIM')!, servers.find((x) => x.stateType === 'DCM')!].filter((x) => x);
  }, [moduleState]);
  // const initialModuleState = useMemo(() => data?.[SOCKET_MESSAGE.INITIAL_MODULE_STATE], [data]);
  /* ======   function    ====== */
  const send = <T>(type: SOCKET_NAME, data: T | null = null) =>
    ws.current?.send(JSON.stringify({ type, compress: 0, data: JSON.stringify(data) }));
  const init = useDebounce<void>(() => send(type));
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!auth?.token) return;
    if (status === WS_STATUS.OPEN) init();

    if (ws.current) return;
    logger('useEffect init');

    ws.current = new WebSocket(webSocketUrl(auth.token));
    ws.current.onopen = () => {
      window.send = send;
      setStatus(WS_STATUS.OPEN);
    };
    ws.current.onclose = () => {
      ws.current = null;
      setStatus(WS_STATUS.CLOSED);
    };
    ws.current.onmessage = (message: MessageEvent<SocketData<unknown>>) => {
      logger(message);
      const data = strToParse<SocketData<unknown>>(message.data);
      switch (data.type) {
        case SOCKET_MESSAGE.INITIAL_MODULE_STATE:
        case SOCKET_MESSAGE.TCM_INFO:
          setData((prev) => [...prev, data]);
          break;
        case SOCKET_MESSAGE.TCM_EVENT_SET:
          setAlarm(
            Object.values(data.data as Object)
              .map((x) => toFormat({ ...x, alarmCode: x.EventCode }))
              .filter((x) => x) as Alarm<TITAN_INTERNAL_EVENT_ID>[],
          );
          break;
        case SOCKET_MESSAGE.TCM_ALARM_SET:
          setAlarm(
            Object.values(data.data as Object)
              .map((x) => toFormat(x.Object))
              .filter((x) => x) as Alarm<TITAN_INTERNAL_EVENT_ID>[],
          );
          break;
      }
    };
    // return () => {
    //   logger('clear', ws.current.readyState === ws.current.OPEN);
    //   if (ws.current.readyState === ws.current.OPEN) ws.current.close();
    // };
  }, [auth?.token, status]);
  return {
    status,
    tcmList,
    serverList,
    alarm,
  };
};

export default useSocket;
