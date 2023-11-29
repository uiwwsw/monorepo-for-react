import { createLogger } from '@package-frontend/utils';
import Input, { InputProps } from '.';
import { ChangeEvent, useRef } from 'react';
import useToasts from '#/useToasts';
/* ======   interface   ====== */
export interface InputNumericProps extends InputProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  maxMessage?: (nextValue: number, limit: number) => string;
  minMessage?: (nextValue: number, limit: number) => string;
}
/* ======    global     ====== */
const logger = createLogger('components/Input/Numeric');

const InputNumeric = ({
  defaultValue = 0,
  onChange,
  min = 0,
  max = 999,
  maxMessage = (nextValue: number, limit: number) => `${nextValue}은 ${limit}보다 커서 입력할 수 없습니다.`,
  minMessage = (nextValue: number, limit: number) => `${nextValue}은 ${limit}보다 작아서 입력할 수 없습니다.`,
  ...props
}: InputNumericProps) => {
  /* ======   variables   ====== */
  const { Toasts, showToast } = useToasts();
  const value = useRef<string>(defaultValue.toString());
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    const newValue = Number(strValue);
    if (isNaN(newValue)) return ref.current && (ref.current.value = value.current.toString());

    if (newValue > max || (newValue < min && strValue !== '')) {
      if (newValue > max) showToast({ message: maxMessage(newValue, max) });
      else showToast({ message: minMessage(newValue, min) });
      return ref.current && (ref.current.value = value.current.toString());
    }

    value.current = strValue;
    strValue && onChange && onChange(e);
  };
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      {Toasts}
      <Input {...props} ref={ref} type="number" onChange={handleChange} />
    </>
  );
};

export default InputNumeric;
