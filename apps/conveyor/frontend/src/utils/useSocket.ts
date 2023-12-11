// import io from 'socket.io-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
import { SOCKET_MESSAGE, SOCKET_NAME, SocketData } from '!/socket/domain';
import { useDebounce } from '@library-frontend/ui';
import { Alarm, CommunicationList, ServerList, TcmList } from '!/control/domain';
import { MODULE_STATE_CHANGE_MSGS, TITAN_INTERNAL_EVENT_ID } from '!/alarm/domain';
import { ContextProps, WS_STATUS } from '@/SocketDataContext';
import { HttpError } from './http';
import { useConfig } from '!/config/application/get-config';
import { AlarmInfoObject, EquipmentStateObject, ModuleState, TCMInfo } from '@package-backend/types';

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
  const { data: config } = useConfig();
  const { data: auth } = useGetAuth();
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WS_STATUS>(ws.current?.readyState ?? WS_STATUS['CONNECTING']);
  const [data, setData] = useState<SocketData<unknown>[]>([]);
  const [alarm, setAlarm] = useState<Alarm[]>([]);
  const [equipment, setEquipment] = useState<EquipmentStateObject>();

  const moduleState: Map<string, ModuleState> = useMemo(
    () =>
      data
        .filter((x) => x.type === SOCKET_MESSAGE.INITIAL_MODULE_STATE)
        .reduce((a, v) => {
          const data = v.data as ModuleState;
          a.set(`${data.ID ?? data.StateType}`, data);
          return a;
        }, new Map()),
    [data],
  );

  const tcmInfo: Map<string, TCMInfo> = useMemo(
    () =>
      data
        .filter((x) => x.type === SOCKET_MESSAGE.TCM_INFO)
        .reduce((a, v) => {
          const data = v.data as TCMInfo;
          a.set(`${data.TCMID}`, { ...data });
          return a;
        }, new Map()),
    [data],
  );
  const tcmList: TcmList[] = useMemo(
    () => Array.from(tcmInfo).map(([id, x]) => new TcmList({ ...x, alive: moduleState.get(id)?.Alive ?? 0 })),
    [moduleState, tcmInfo],
  );
  // const serverList: ServerList[] = useMemo(() => {
  //   const servers = Array.from(moduleState)
  //     .filter(([_, x]) => ['HIM', 'DCM'].includes(x.stateType))
  //     .reverse()
  //     .map(([_, x]) => ({
  //       ...x,
  //       stateType: x.stateType as SERVER_TYPE,
  //       status: ALIVE[x.alive ?? 0] as keyof typeof ALIVE,
  //     }));
  //   return [servers.find((x) => x.stateType === 'HIM')!, servers.find((x) => x.stateType === 'DCM')!].filter((x) => x);
  // }, [moduleState]);
  const serverList: ServerList[] = useMemo(
    () =>
      Array.from(moduleState)
        .filter(([_, x]) => ['HIM', 'DCM'].includes(x.StateType))
        .reverse()
        .map(([_, x]) => new ServerList(x)),
    [moduleState],
  );
  const communicationList: CommunicationList[] = useMemo(
    () =>
      Object.entries(equipment ?? {})
        .filter(([_, value]) => value && Object.values(value).length > 0)
        .map(([key, value]) => new CommunicationList({ ...value, type: key })),
    [equipment],
  );

  // const initialModuleState = useMemo(() => data?.[SOCKET_MESSAGE.INITIAL_MODULE_STATE], [data]);
  /* ======   function    ====== */
  const send = <T>(type: SOCKET_NAME, data: T | null = null) =>
    ws.current?.send(JSON.stringify({ type, compress: 0, data: JSON.stringify(data) }));
  const init = useDebounce<void>(() => send(type));
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!auth?.token || !config?.WS_API) return;
    if (status === WS_STATUS.OPEN) init();

    if (ws.current) return;
    ws.current = new WebSocket(`${config?.WS_API}/ws/?token=${auth.token}`);
    ws.current.onopen = () => {
      window.send = send;
      setStatus(WS_STATUS.OPEN);
      clearTimeout(sto);
      sto = setTimeout(() => (tryOut = limit), 1000);
    };
    ws.current.onclose = () => {
      clearTimeout(sto);
      // TODO 인증정보 체크하는 api 가 필요한 부분
      // 소켓이라 인증 정보가 유효한지 체크하지 못함
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
        case SOCKET_MESSAGE.HIM_EQUIPMENT_STATE_INFO:
          setEquipment(data.data as EquipmentStateObject);
          break;
        case SOCKET_MESSAGE.TCM_EVENT_SET:
          const alarm = Object.values(data.data as AlarmInfoObject).map((x) => new Alarm(x));
          setAlarm(alarm);
          alarm
            .filter((x) => x.eventCode && MODULE_STATE_CHANGE_MSGS.includes(x.eventCode))
            .forEach((x) => {
              switch (x.eventCode) {
                case TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_DCM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        Alive: 1,
                        StateType: 'DCM',
                      } as ModuleState,
                    },
                  ]);
                  break;
                case TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_DCM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        Alive: 0,
                        StateType: 'DCM',
                      } as ModuleState,
                    },
                  ]);
                  break;
                case TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_HIM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        Alive: 0,
                        StateType: 'HIM',
                      } as ModuleState,
                    },
                  ]);
                  break;
                case TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_HIM:
                  setData((prev) => [
                    ...prev,
                    {
                      type: SOCKET_MESSAGE.INITIAL_MODULE_STATE,
                      data: {
                        Alive: 0,
                        StateType: 'HIM',
                      } as ModuleState,
                    },
                  ]);
                  break;
              }
            });
          break;
      }
    };
  }, [auth?.token, config?.WS_API, status]);
  return {
    status,
    communicationList,
    tcmList,
    serverList,
    alarm,
  };
};

export default useSocket;
