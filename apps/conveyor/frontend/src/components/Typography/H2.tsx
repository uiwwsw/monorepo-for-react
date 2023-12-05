import { createLogger } from '#/logger';
import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface H2Props {
  children: ReactNode;
}

/* ======    global     ====== */
const logger = createLogger('components/Typography/H2');
const H2 = ({ children }: H2Props) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <h2 className="text-xl font-bold first-letter:uppercase">{children}</h2>;
};

export default H2;
