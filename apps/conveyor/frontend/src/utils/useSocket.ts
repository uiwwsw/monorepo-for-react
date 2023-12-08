// import io from 'socket.io-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createLogger, toFormat } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
import { Alarm, ModuleState, SOCKET_MESSAGE, SOCKET_NAME, SocketData, TcmInfo } from '!/socket/domain';
import { useDebounce } from '@library-frontend/ui';
import { CONTROL_STATUS, SERVER_TYPE, ServerList, TcmList } from '!/control/domain';
import { MODULE_STATE_CHANGE_MSGS, TITAN_INTERNAL_EVENT_ID } from '!/alarm/domain';
import { ContextProps, WS_STATUS } from '@/SocketDataContext';
import { HttpError } from './http';

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

let sto: NodeJS.Timeout;
const limit = 5;
let tryOut = 0;
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

    ws.current = new WebSocket(`${process.env.WS_API}/ws/?token=${auth.token}`);
    ws.current.onopen = () => {
      window.send = send;
      setStatus(WS_STATUS.OPEN);
      clearTimeout(sto);
      sto = setTimeout(() => (tryOut = limit), 1000);
    };
    ws.current.onclose = () => {
      clearTimeout(sto);
      if (++tryOut > limit) throw new HttpError('invalid-session', { status: 403 });
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
          const alarm = Object.values(data.data as Object)
            .map((x) => toFormat({ ...x, alarmCode: x.EventCode }))
            .filter((x) => x) as Alarm<TITAN_INTERNAL_EVENT_ID>[];
          setAlarm(alarm);
          alarm
            .filter((x) => x.alarmCode && MODULE_STATE_CHANGE_MSGS.includes(x.alarmCode))
            .forEach((x) => {
              switch (x.alarmCode) {
                case TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_DCM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        alive: 1,
                        stateType: 'DCM',
                      },
                    },
                  ]);
                  break;
                case TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_DCM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        alive: 0,
                        stateType: 'DCM',
                      },
                    },
                  ]);
                  break;
                case TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_HIM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        alive: 1,
                        stateType: 'HIM',
                      },
                    },
                  ]);
                  break;
                case TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_HIM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        alive: 0,
                        stateType: 'HIM',
                      },
                    },
                  ]);
                  break;
              }
            });
          break;
      }
    };
  }, [auth?.token, status]);
  return {
    status,
    tcmList,
    serverList,
    alarm,
  };
};

export default useSocket;
