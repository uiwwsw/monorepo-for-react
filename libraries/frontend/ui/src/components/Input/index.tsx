import { ChangeEvent, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import Underbar from '$/Underbar';
import { createLogger } from '@package-frontend/utils';
import useDebounce from '#/useDebounce';

/* ======   interface   ====== */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  debounceTime?: number;
  slots?: ReactNode;
}
/* ======    global     ====== */
const logger = createLogger('components/Input');

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder = '내용을 입력하세요.',
      className,
      onChange,
      error,
      type,
      debounceTime = 0,
      slots = <Underbar error={error} />,
      ...props
    },
    ref,
  ) => {
    /* ======   variables   ====== */
    const handleChange = debounceTime ? useDebounce<ChangeEvent<HTMLInputElement>>(onChange, debounceTime) : onChange;
    const wrapClassName = `inline-flex items-center relative${className ? ` ${className}` : ''}`;
    const inputClassName = `w-full focus:outline-none p-3 bg-transparent outline-none`;

    /* ======   function    ====== */
    /* ======   useEffect   ====== */
    logger('render');

    return (
      <label className={wrapClassName}>
        {type === 'search' ? <span className="ml-3 -mr-4 pr-2">🔍︎</span> : ''}
        <input
          {...props}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={inputClassName}
          onChange={handleChange}
        />
        {slots}
      </label>
    );
  },
);

export default Input;
