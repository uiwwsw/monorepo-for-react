import { createLogger } from '#/logger';
import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface EmptyProps {
  children?: ReactNode;
}

/* ======    global     ====== */
const logger = createLogger('components/Empty');
const className = 'text-gray-200';
export const emptyClassName = 'empty:text-gray-200 empty:after:content-["EMPTY"]';
const Empty = ({ children = 'EMPTY' }: EmptyProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <span className={className}>{children}</span>;
};

export default Empty;
