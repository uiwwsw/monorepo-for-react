import { Numeric } from '@library-frontend/ui';
import { ChangeEvent } from 'react';

/* ======   interface   ====== */
export interface SettingInputProps {
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
}
/* ======    global     ====== */
const SettingInput = ({ label, onChange, value, placeholder }: SettingInputProps) => {
  /* ======   variables   ====== */

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex items-center">
      <span className="text-lg">{label}</span>:
      <div className="ml-3">
        <Numeric placeholder={placeholder} min={5} max={100} value={value} onChange={onChange} />
        {/* <RadioGroup id={label} defaultValue={defaultValue} onChange={onChange} labels={labels} /> */}
      </div>
    </div>
  );
};

export default SettingInput;
