import { convertAlarmToMessage } from '!/alarm/domain';
import useSocket from '#/useSocket';
import SocketDataContext from '@/SocketDataContext';
import { useEffect } from 'react';
import Pages from 'src/Pages';
// import { createLogger } from '@package-frontend/utils';
import useToastsForAlarm from '#/useToastsForAlarm';
import { SOCKET_NAME } from '!/socket/domain';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('App');

const App = () => {
  /* ======   variables   ====== */
  const { tcmList, serverList, alarm, status } = useSocket(SOCKET_NAME.ZONE_GET_INFO);
  const { Toasts, showToast } = useToastsForAlarm();
  // const t = import.meta.env.VITE_APP
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(
    () => alarm.forEach((x) => showToast({ message: convertAlarmToMessage(x), serialNo: x.serialNo })),
    [alarm],
  );
  return (
    <>
      {Toasts}
      <SocketDataContext.Provider value={{ tcmList, serverList, alarm, status }}>
        <Pages />
      </SocketDataContext.Provider>
    </>
  );
};

export default App;
