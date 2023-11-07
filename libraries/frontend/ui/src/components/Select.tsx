import { ChangeEvent, SelectHTMLAttributes, forwardRef, useCallback, useState } from 'react';
import Underbar, { focusClassName as decoratorClassName } from '$/Underbar';
import Caret, { focusClassName as caretClassName } from '$/Caret';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options?: {
    value: string;
    label: string;
    disabled?: boolean;
    hidden?: boolean;
  }[];
}
/* ======    global     ====== */
const logger = createLogger('components/Select');

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ placeholder = 'Select box', disabled, value = '', onChange, className, error, options = [], ...props }, ref) => {
    /* ======   variables   ====== */
    const [init, setInit] = useState(false);
    const adapterOption: SelectProps['options'] = [
      { disabled: true, hidden: true, label: placeholder, value: '' },
      ...options,
    ];
    const selectClassName = `${decoratorClassName} ${caretClassName} focus:outline-none pl-3 py-3 pr-8 bg-transparent rounded appearance-none outline-none${
      className ? ` ${className}` : ''
    }${value === '' && !init ? ' text-gray-400' : ''} w-full`;

    /* ======   function    ====== */
    const adapterChange = (e: ChangeEvent<HTMLSelectElement>) => {
      // if (ref && 'current' in ref) (ref.current as HTMLSelectElement).blur();
      onChange && onChange(e);
      !init && setInit(true);
    };
    const getOptionClassName = useCallback(
      (x: { disabled?: boolean }) => (x.disabled ? 'text-gray-400' : 'text-gray-800'),
      [],
    );

    /* ======   useEffect   ====== */
    logger('render');
    return (
      <span className="inline-flex items-center relative w-full">
        <select
          {...props}
          disabled={disabled}
          defaultValue={value}
          onChange={adapterChange}
          ref={ref}
          className={selectClassName}
        >
          {adapterOption.map((x, i) => (
            <option className={getOptionClassName(x)} key={i} value={x.value} disabled={x.disabled} hidden={x.hidden}>
              {x.label}
            </option>
          ))}
        </select>
        <Caret disabled={disabled} className="!w-0 -translate-x-6" />
        <Underbar disabled={disabled} error={error} />
      </span>
    );
  },
);
//gridColumn: `span ${colspan}`, gridRowEnd: `span ${rowspan}`
export default Select;
