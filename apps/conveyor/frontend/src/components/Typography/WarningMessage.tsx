import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface WarningMessageProps {
  children?: ReactNode;
  show?: boolean;
}

/* ======    global     ====== */
const WarningMessage = ({ children, show = true }: WarningMessageProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return show ? <p className={`text-red-500${!children ? ' hidden' : ''}`}>💥 {children}</p> : null;
};

export default WarningMessage;
