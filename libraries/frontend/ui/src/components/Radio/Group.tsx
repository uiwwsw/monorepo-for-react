import { WithTheme } from '#/componentTypes';
import Radio, { RadioBaseProps } from '@/Radio/Base';
import { createLogger } from '@package-frontend/utils';
import { ChangeEvent, useRef } from 'react';
/* ======   interface   ====== */
export interface RadioGroupProps extends RadioBaseProps, WithTheme {
  labels: (string | number)[];
  className?: string;
  id: string;
}
/* ======    global     ====== */
const logger = createLogger('components/RadioGroup');
const RadioGroup = ({
  labels,
  themeColor = 'primary',
  themeSize = 'xl',
  className,
  defaultValue,
  value,
  id,
  onChange,
  ...props
}: RadioGroupProps) => {
  /* ======   variables   ====== */
  const ref = useRef(value ?? defaultValue);
  const groupClassName = `[&>*]:m-2${className ? ` ${className}` : ''}`;
  /* ======   function    ====== */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    ref.current = e.target.value;
    onChange && onChange(e);
    logger('handleChange');
  };
  /* ======   useEffect   ====== */
  return (
    <div className={groupClassName} data-size={themeSize} data-color={themeColor}>
      {labels.map((label, index) => (
        <Radio
          {...props}
          onChange={handleChange}
          value={label}
          key={id + label + index}
          name={id}
          checked={value ? ref.current === label : undefined}
          defaultChecked={defaultValue ? ref.current === label : undefined}
        >
          {`${label}`}
        </Radio>
      ))}
    </div>
  );
};

export default RadioGroup;
