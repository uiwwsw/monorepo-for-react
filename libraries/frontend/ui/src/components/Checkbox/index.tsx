import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
// import { createLogger } from '@package-frontend/utils';
import { WithTheme } from '#/componentTypes';

/* ======   interface   ====== */
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement>, WithTheme {
  children?: ReactNode;
  indeterminate?: boolean;
}
/* ======    global     ====== */
const commonClassName = `
overflow-hidden
 relative
 [:not([data-indeterminate]):checked+&:before]:scale-[0]
 [:not([data-indeterminate]):checked+&:before]:opacity-0
 shadow-sm 
  shadow-gray-400
  before:absolute
  before:inset-0
  before:transition
  before:origin-center
  before:bg-white
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
[:disabled+&]:!bg-opacity-50
[:disabled+&]:cursor-not-allowed
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
// const logger = createLogger('components/Checkbox');
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, children, themeColor = 'primary', themeSize = 'md', ...props }, ref) => {
    /* ======   variables   ====== */
    /* ======   function    ====== */
    /* ======   useEffect   ====== */

    return (
      <label
        data-color={themeColor}
        data-size={themeSize}
        role="button"
        className="inline-flex align-middle items-center"
      >
        <input
          data-indeterminate={indeterminate === true ? true : null}
          type="checkbox"
          ref={ref}
          className="hidden"
          {...props}
        />
        <i className={commonClassName + sizeClassName + colorClassName} />
        {children && (
          <span className="ml-2 text-xs [:disabled~&]:opacity-50 [:disabled~&]:cursor-not-allowed" role="textbox">
            {children}
          </span>
        )}
      </label>
    );
  },
);

export default Checkbox;
