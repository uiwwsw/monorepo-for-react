import { memo } from 'react';

/* ======   interface   ====== */
export interface UnderbarProps {
  active?: boolean;
  error?: boolean;
  disabled?: boolean;
}
/* ======    global     ====== */
export const focusClassName = '[&:focus~[data-id="controller-decorator"]>i]:scale-x-100';
const commonClassName = `absolute transition left-0 right-0 h-0.5 bottom-0`;
const Underbar = ({ error, active, disabled }: UnderbarProps) => {
  /* ======   variables   ====== */
  const coverClassName = commonClassName + ' bg-gray-400';
  const decoratorClassName = `${commonClassName} scale-x-0 transition-transform ${
    error ? 'bg-red-400 scale-x-100' : 'bg-blue-500'
  }${disabled ? ' bg-gray-200 scale-x-100' : ''}${active ? ' scale-x-100' : ''}`;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <i className={coverClassName} data-id="controller-decorator">
      <i className={decoratorClassName}></i>
    </i>
  );
};
export default memo(Underbar);
