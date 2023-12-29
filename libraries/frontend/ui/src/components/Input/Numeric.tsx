import { createLogger } from '@package-frontend/utils';
import Input, { InputProps } from '.';
import { ChangeEvent, FocusEvent, useRef, useState } from 'react';
import useToasts from '#/useToasts';
/* ======   interface   ====== */
export interface InputNumericProps extends InputProps {
  min?: number;
  max?: number;
  value?: number;
  maxMessage?: (nextValue: number, limit: number) => string;
  minMessage?: (nextValue: number, limit: number) => string;
}
/* ======    global     ====== */
const logger = createLogger('components/Input/Numeric');

const InputNumeric = ({
  onChange,
  min = 0,
  max = 999,
  maxMessage = (nextValue: number, limit: number) => `${nextValue}은 ${limit}보다 커서 입력할 수 없습니다.`,
  minMessage = (nextValue: number, limit: number) => `${nextValue}은 ${limit}보다 작아서 입력할 수 없습니다.`,
  onFocus,
  onBlur,
  value,
  defaultValue,
  ...props
}: InputNumericProps) => {
  /* ======   variables   ====== */
  const [focus, setFocus] = useState(false);
  const { Toasts, showToast } = useToasts();
  const ref = useRef<HTMLInputElement>(null);
  const getValue = (value: string) => {
    const number = Number(value);
    if (isNaN(number)) return '';

    if (number > max || number < min) {
      if (number > max) {
        showToast({ message: maxMessage(number, max) });
        return max.toString();
      } else if (value !== '') {
        return min.toString();
      } else {
        return '';
      }
    }
    return value;
  };
  const setValue = (value: string) => ref.current && (ref.current.value = value);
  const handleFocus = () => setFocus(true);
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocus(false);
    const strValue = e.target.value;
    const newValue = getValue(strValue);
    if (!newValue) return setValue(`${defaultValue ?? value}`);
    if (newValue !== value?.toString()) {
      setValue(newValue);
      onChange && onChange(e);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    const newValue = getValue(strValue);
    if (!newValue) return;
    if (+strValue < min) return;
    if (newValue !== value?.toString()) {
      // cache.current = newValue;
      setValue(newValue);
      onChange && onChange(e);
    }
    logger('handleChange', e);
  };
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <Input
        {...props}
        defaultValue={defaultValue}
        value={focus ? undefined : value}
        ref={ref}
        type="number"
        min={min}
        max={max}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </>
  );
};

export default InputNumeric;
