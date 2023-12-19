import { ChangeEvent, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import Underbar from '$/Underbar';
// import { createLogger } from '@package-frontend/utils';
import useDebounce from '#/useDebounce';

/* ======   interface   ====== */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  debounceTime?: number;
  slots?: ReactNode;
}
/* ======    global     ====== */
// const logger = createLogger('components/Input');

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
    /* ======   function    ====== */
    /* ======   useEffect   ====== */

    return (
      <label className={`inline-flex items-center relative${className ? ` ${className}` : ''}`}>
        {type === 'search' ? <span className="ml-3 -mr-4 pr-2">🔍︎</span> : ''}
        <input
          {...props}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={`w-full focus:outline-none p-3 bg-transparent outline-none text-ellipsis [&[type="file"]]:leading-[1.125]`}
          onChange={handleChange}
        />
        {slots}
      </label>
    );
  },
);

export default Input;
