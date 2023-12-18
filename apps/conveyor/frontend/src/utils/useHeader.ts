// import io from 'socket.io-client';
import { ReactNode, useState } from 'react';
import { ContextProps } from '@/HeaderContext';
/* ======   interface   ====== */

/* ======    global     ====== */
const useHeader = (): ContextProps => {
  /* ======   variables   ====== */
  const [children, setChildren] = useState<ReactNode>(undefined);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return {
    children,
    setChildren,
  };
};

export default useHeader;
