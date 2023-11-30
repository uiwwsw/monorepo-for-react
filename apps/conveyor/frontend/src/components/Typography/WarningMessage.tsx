import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface WarningMessageProps {
  children?: ReactNode;
}

/* ======    global     ====== */
const logger = createLogger('components/Typography/WarningMessage');
const WarningMessage = ({ children }: WarningMessageProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <p className={`text-red-500${children === undefined ? ' hidden' : ''}`}>💥 {children}</p>;
};

export default WarningMessage;
