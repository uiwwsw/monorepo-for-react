import { TITAN_INTERNAL_EVENT_ID } from '!/alarm/domain';
import { ServerList, TcmList } from '!/controls/domain';
import { Alarm } from '!/socket/domain';
import { createContext, useContext } from 'react';
export const enum STATUS {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}
export interface ContextProps {
  status: STATUS;
  tcmList: TcmList[];
  serverList: ServerList[];
  alarm: Alarm<TITAN_INTERNAL_EVENT_ID>[];
}
const SocketDataContext = createContext<ContextProps>({
  status: STATUS.CONNECTING,
  tcmList: [],
  serverList: [],
  alarm: [],
});
export const useSocketDataContext = () => useContext(SocketDataContext);

export default SocketDataContext;
