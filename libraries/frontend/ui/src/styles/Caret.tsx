import { memo } from 'react';

/* ======   interface   ====== */
export interface CaretProps {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}
/* ======    global     ====== */
const Caret = ({ active, className, disabled }: CaretProps) => {
  /* ======   variables   ====== */ className = '';
  const wrapClassName = `relative w-4 -translate-x-2 h-0 pointer-events-none transition align-middle self-center [:focus~&]:-scale-y-100 [:focus~&]:-translate-y-0${
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
