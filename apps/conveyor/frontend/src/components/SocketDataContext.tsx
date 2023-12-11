import { Alarm, CommunicationList, ServerList, TcmList } from '!/control/domain';
import { createContext, useContext } from 'react';
export const enum WS_STATUS {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}
export interface ContextProps {
  status: WS_STATUS;
  communicationList: CommunicationList[];
  tcmList: TcmList[];
  serverList: ServerList[];
  alarm: Alarm[];
}
const SocketDataContext = createContext<ContextProps>({
  status: WS_STATUS.CONNECTING,
  communicationList: [],
  tcmList: [],
  serverList: [],
  alarm: [],
});
export const useSocketDataContext = () => useContext(SocketDataContext);

export default SocketDataContext;
