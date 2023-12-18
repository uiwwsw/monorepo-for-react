import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface WarningMessageProps {
  children?: ReactNode;
}

/* ======    global     ====== */
const WarningMessage = ({ children }: WarningMessageProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return <p className={`text-red-500${!children ? ' hidden' : ''}`}>💥 {children}</p>;
};

export default WarningMessage;
