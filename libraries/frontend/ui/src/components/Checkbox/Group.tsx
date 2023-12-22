import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';
import Checkbox from '@/Checkbox';

/* ======   interface   ====== */
export type Key<T> = keyof T & string;
export type Obj<T, J = boolean> = Record<Key<T>, J>;
export interface CheckboxGroupProps<T> {
  labels: Key<T>[];
  fixHead?: Partial<Obj<T, string>>;
  className?: string;
  disabled?: Partial<Obj<T>>;
  defaultChecks?: Partial<Obj<T>>;
  onChange?: (value?: Partial<Obj<T>>) => void;
}
/* ======    global     ====== */
const logger = createLogger('components/Checkbox/Group');
const CheckboxGroup = <T,>({
  fixHead,
  disabled,
  labels,
  className,
  defaultChecks,
  onChange,
}: CheckboxGroupProps<T>) => {
  /* ======   variables   ====== */
  const [obj, setObj] = useState(defaultChecks);
  /* ======   function    ====== */
  const setValue = (x: Partial<Obj<T>>) => {
    const value = { ...obj, ...x };
    setObj(value);
    onChange && onChange(value);
    logger(value);
  };
  /* ======   useEffect   ====== */
  return (
    <div className={`[&>*+*]:ml-2 ${className ? ` ${className}` : ''}`}>
      {labels.map((x, index) => (
        <Checkbox
          key={`${x}_${index}`}
          disabled={disabled?.[x]}
          defaultChecked={obj?.[x]}
          onClick={(e) => setValue({ [x]: e.currentTarget.checked } as Partial<Obj<T>>)}
        >
          {fixHead?.[x] ?? x}
        </Checkbox>
      ))}
    </div>
  );
};

export default CheckboxGroup;
