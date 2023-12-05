import { createLogger } from '#/logger';
import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface H1Props {
  children: ReactNode;
}

/* ======    global     ====== */
const logger = createLogger('components/Typography/H1');
const H1 = ({ children }: H1Props) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <h1 className="text-2xl font-bold first-letter:uppercase">{children}</h1>;
};

export default H1;
