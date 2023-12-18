import { createLogger } from '@package-frontend/utils';
import { MouseEvent, MouseEventHandler, memo } from 'react';
/* ======   interface   ====== */
export interface PaginationArrowProps {
  disabled?: boolean;
  children: string;
  onClick?: MouseEventHandler;
}
/* ======    global     ====== */
const logger = createLogger('components/Pagination/PaginationArrow');
const PaginationArrow = ({ children, disabled, onClick }: PaginationArrowProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  const handleClick = (e: MouseEvent) => {
    if (disabled) return;
    onClick && onClick(e);
    logger('handleClick');
  };
  /* ======   useEffect   ====== */

  return (
    <div
      role="button"
      onClick={handleClick}
      className={`px-2.5 py-2 border ${disabled ? 'text-gray-400 cursor-default' : 'hover:bg-gray-300 cursor-pointer'}`}
    >
      {children}
    </div>
  );
};

export default memo(PaginationArrow);
