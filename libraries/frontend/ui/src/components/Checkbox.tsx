import { InputHTMLAttributes, forwardRef } from 'react';
import { createLogger } from '@package-frontend/utils';
import { WithTheme } from '#/componentTypes';

/* ======   interface   ====== */
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement>, WithTheme {
  children?: string;
  indeterminate?: boolean;
}
/* ======    global     ====== */
const commonClassName = `
overflow-hidden
 relative
 [:not([data-indeterminate]):checked+&:before]:scale-0
 shadow-sm 
  shadow-gray-400
  before:absolute
  before:left-1/2
  before:top-1/2
  before:absolute
  before:transition
  before:origin-center
 before:scale-[10]
 before:border-2
 before:border
 before:border-white
 after:border-white
 after:absolute
 after:border-2
 after:rotate-45
 after:top-1/2
 after:left-1/2
 after:-ml-1 
 after:-mt-2 
 after:border-t-0
 after:border-l-0
 after:w-2
 after:h-3
 after:origin-center
 [[data-indeterminate]+&:after]:rotate-90
 [[data-indeterminate]+&:after]:border-b-0
 [[data-indeterminate]+&:after]:-mt-2.5
 [[data-indeterminate]+&:after]:border-gray-500
`;
const sizeClassName = `
[[data-size="sm"]>&]:w-5 [[data-size="sm"]>&]:h-5
[[data-size="md"]>&]:w-6 [[data-size="md"]>&]:h-6
[[data-size="xl"]>&]:w-7 [[data-size="xl"]>&]:h-7
`;
const colorClassName = `
[[data-color="primary"]>&]:bg-blue-500
[[data-color="secondary"]>&]:bg-slate-500
`;
const logger = createLogger('components/Checkbox');
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, children, themeColor = 'primary', themeSize = 'md', ...props }, ref) => {
    /* ======   variables   ====== */
    /* ======   function    ====== */
    /* ======   useEffect   ====== */
    logger('render');

    return (
      <label
        data-color={themeColor}
        data-size={themeSize}
        role="button"
        className="inline-flex align-middle items-center"
      >
        <input data-indeterminate={indeterminate} type="checkbox" ref={ref} className="hidden" {...props} />
        <i className={commonClassName + sizeClassName + colorClassName} />
        {children && (
          <span className="ml-2 text-xs" role="textbox">
            {children}
          </span>
        )}
      </label>
    );
  },
);

export default Checkbox;
