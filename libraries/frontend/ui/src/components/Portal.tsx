// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
/* ======   interface   ====== */
export interface PortalProps {
  children: ReactNode;
  root?: string;
}
/* ======    global     ====== */
// const logger = createLogger('components/Portal');
const Portal = ({ children, root }: PortalProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return createPortal(children, document.getElementById(root ?? '') ?? document.body);
};

export default Portal;
