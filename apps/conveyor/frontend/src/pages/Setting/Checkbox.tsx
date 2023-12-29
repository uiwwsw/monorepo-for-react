import { Checkbox } from '@library-frontend/ui';
import { ChangeEvent } from 'react';

/* ======   interface   ====== */
export interface SettingCheckboxProps {
  checked: boolean;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
/* ======    global     ====== */
const SettingCheckbox = ({ checked, label, onChange }: SettingCheckboxProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */

  /* ======   useEffect   ====== */
  return (
    <div className="flex items-center">
      <span className="text-lg">{label}</span>:
      <div className="ml-3">
        <Checkbox onChange={onChange} checked={checked} />
      </div>
    </div>
  );
};

export default SettingCheckbox;
