import { createLogger } from '@package-frontend/utils';
import Input, { InputProps } from '.';
import { ChangeEvent, useRef, useState } from 'react';
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
  value: defaultValue,
  ...props
}: InputNumericProps) => {
  /* ======   variables   ====== */
  const [value, setValue] = useState(defaultValue);
  const [focus, setFocus] = useState(false);
  const { Toasts, showToast } = useToasts();
  const ref = useRef<HTMLInputElement>(null);
  const handleFocus = () => setFocus(true);
  const handleBlur = () => {
    setFocus(false);
    return ref.current && (ref.current.value = value?.toString() ?? '');
  };
  // const handleBlur =
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    const newValue = Number(strValue);
    if (isNaN(newValue)) return ref.current && (ref.current.value = value?.toString() ?? '');

    if (newValue > max || newValue < min) {
      if (newValue > max) showToast({ message: maxMessage(newValue, max) });
      else showToast({ message: minMessage(newValue, min) });
      return;
    }
    if (newValue !== value) {
      setValue(newValue);
      onChange && onChange(e);
    }
  };
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      {Toasts}
      <Input
        {...props}
        value={focus ? undefined : value}
        ref={ref}
        type="number"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </>
  );
};

export default InputNumeric;
