// import io from 'socket.io-client';
import { ReactNode, useState } from 'react';
import { ContextProps } from '@/HeaderContext';
/* ======   interface   ====== */

/* ======    global     ====== */
const initHeader = (): ContextProps => {
  /* ======   variables   ====== */
  const [children, setChildren] = useState<ReactNode>(undefined);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return {
    children,
    setChildren,
  };
};

export default initHeader;
