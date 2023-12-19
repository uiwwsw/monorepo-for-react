import { useEffect } from 'react';
import notificationSound from '/notification.wav';
import useSetting from './useSetting';
/* ======   interface   ====== */

export interface useSoundProps {}
/* ======    global     ====== */
// const logger = createLogger('utils/useSound');
const useSound = (_?: useSoundProps) => {
  /* ======   variables   ====== */
  const { alarmSound } = useSetting();
  const audio = new Audio(notificationSound);
  /* ======   function    ====== */

  const play = alarmSound ? () => audio.play() : () => null;

  /* ======   useEffect   ====== */
  useEffect(() => audio.load(), [audio]);

  return { play };
};

export default useSound;
