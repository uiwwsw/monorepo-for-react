import { ChangeEvent, SelectHTMLAttributes, forwardRef, useCallback, useState } from 'react';
import Underbar from '$/Underbar';
import Caret from '$/Caret';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
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
  (
    { defaultValue = '', placeholder = 'Select box', disabled, onChange, className, error, options = [], ...props },
    ref,
  ) => {
    /* ======   variables   ====== */
    const [init, setInit] = useState(false);
    const adapterOption: SelectProps['options'] = [
      { disabled: true, hidden: true, label: placeholder, value: '' },
      ...options,
    ];

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
      <label className={`inline-flex items-center relative${className ? ` ${className}` : ''}`}>
        <select
          {...props}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={adapterChange}
          ref={ref}
          className={`flex-1 pl-3 py-3 pr-8 bg-transparent rounded appearance-none outline-none${
            !defaultValue && !init ? ' text-gray-400' : ''
          }`}
        >
          {adapterOption.map((x, i) => (
            <option className={getOptionClassName(x)} key={i} value={x.value} disabled={x.disabled} hidden={x.hidden}>
              {x.label}
            </option>
          ))}
        </select>
        <Caret disabled={disabled} className="!w-0 -translate-x-6" />
        <Underbar disabled={disabled} error={error} />
      </label>
    );
  },
);
//gridColumn: `span ${colspan}`, gridRowEnd: `span ${rowspan}`
export default Select;
