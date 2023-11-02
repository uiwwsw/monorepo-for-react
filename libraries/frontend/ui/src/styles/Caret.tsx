import { memo } from 'react';

/* ======   interface   ====== */
export interface CaretProps {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}
/* ======    global     ====== */
export const focusClassName = '[&:focus~[data-id="caret"]]:-scale-y-100 [&:focus~[data-id="caret"]]:-translate-y-0';
const Caret = ({ active, className, disabled }: CaretProps) => {
  /* ======   variables   ====== */
  const wrapClassName = `relative w-6 h-0 pointer-events-none transition align-middle self-center${
    className ? ` ${className}` : ''
  }${active ? ' -scale-y-100' : ''}`;
  const caretClassName = `absolute w-2 h-2 border-2 border-r-0 border-b-0 border-blue-500 transform translate-x-1/2 -translate-y-1/3 rotate-45${
    disabled ? ' border-gray-200' : ''
  }`;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */

  return (
    <i data-id="caret" className={wrapClassName}>
      <i className={caretClassName} />
    </i>
  );
};
export default memo(Caret);
