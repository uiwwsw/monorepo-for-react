import { TITAN_INTERNAL_EVENT_ID } from '!/alarm/domain';
import { ServerList, TcmList } from '!/control/domain';
import { Alarm } from '!/socket/domain';
import { createContext, useContext } from 'react';
export const enum WS_STATUS {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}
export interface ContextProps {
  status: WS_STATUS;
  tcmList: TcmList[];
  serverList: ServerList[];
  alarm: Alarm<TITAN_INTERNAL_EVENT_ID>[];
}
const SocketDataContext = createContext<ContextProps>({
  status: WS_STATUS.CONNECTING,
  tcmList: [],
  serverList: [],
  alarm: [],
});
export const useSocketDataContext = () => useContext(SocketDataContext);

export default SocketDataContext;
