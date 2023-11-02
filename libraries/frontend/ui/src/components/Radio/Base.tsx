import { WithTheme } from '#/componentTypes';
import { createLogger } from '@package-frontend/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
/* ======   interface   ====== */
export interface RadioBaseProps extends InputHTMLAttributes<HTMLInputElement>, WithTheme {
  children?: string;
  className?: string;
}
/* ======    global     ====== */
const logger = createLogger('components/RadioBase');
const labelClassName = `
ml-2
[[data-size="sm"]>&]:text-sm
[[data-size="md"]>&]:text-md
[[data-size="xl"]>&]:text-xl
`;

const defaultRadioBaseDecoBtnClassName = `
relative
w-6 
h-6 
rounded-full 
shadow-sm 
shadow-gray-400
after:transition-all 
after:absolute
after:w-full
after:h-full
after:bg-white
after:rounded-full
[:checked+&:after]:scale-50
[[data-color="primary"]>&]:bg-blue-500
[[data-color="secondary"]>&]:bg-slate-500
[[data-size="sm"]>&]:w-5 [[data-size="sm"]>&]:h-5  
[[data-size="md"]>&]:w-6 [[data-size="md"]>&]:h-6
[[data-size="xl"]>&]:w-7 [[data-size="xl"]>&]:h-7
  `;
const RadioBase = forwardRef<HTMLInputElement, RadioBaseProps>(
  ({ children, themeColor = 'primary', themeSize = 'md', ...props }, ref) => {
    /* ======   variables   ====== */
    /* ======   function    ====== */
    /* ======   useEffect   ====== */
    logger('render');
    return (
      <label role="button" className="inline-flex items-center" data-color={themeColor} data-size={themeSize}>
        <input ref={ref} type="radio" className="hidden" {...props} />
        <i className={defaultRadioBaseDecoBtnClassName} />
        {children && (
          <span role="textbox" className={labelClassName}>
            {children}
          </span>
        )}
      </label>
    );
  },
);

export default RadioBase;
