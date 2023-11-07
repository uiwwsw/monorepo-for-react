import { InputHTMLAttributes, forwardRef } from 'react';
import Underbar, { focusClassName } from '$/Underbar';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
/* ======    global     ====== */
const logger = createLogger('components/Checkbox');
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder = '내용을 입력하세요.', className, error, type, ...props }, ref) => {
    /* ======   variables   ====== */
    const wrapClassName = `inline-flex items-center relative${className ? ` ${className}` : ''}`;
    const inputClassName = `w-full focus:outline-none ${focusClassName} p-1 bg-transparent outline-none`;
    /* ======   function    ====== */
    /* ======   useEffect   ====== */
    logger('render');
    return (
      <span className={wrapClassName}>
        {type === 'search' ? <span className="ml-3 -mr-4 pr-2">🔍︎</span> : ''}
        <input {...props} type={type} ref={ref} placeholder={placeholder} className={inputClassName} />
        <Underbar error={error} />
      </span>
    );
  },
);

export default Input;
