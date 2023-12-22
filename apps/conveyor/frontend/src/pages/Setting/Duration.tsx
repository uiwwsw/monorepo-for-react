import { useTranslation } from 'react-i18next';
import { Numeric } from '@library-frontend/ui';
import { ChangeEvent } from 'react';

/* ======   interface   ====== */
export interface SettingDurationProps {
  label: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
/* ======    global     ====== */
const SettingDuration = ({ value, label, onChange }: SettingDurationProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  /* ======   function    ====== */

  /* ======   useEffect   ====== */
  return (
    <div className="flex items-center">
      <span className="text-lg">{label}</span>:
      <div className="ml-3">
        <Numeric placeholder={t('기간을 입력해주세요.')} min={1} max={60} value={value} onChange={onChange} />
        {/* <RadioGroup id={label} value={defaultValue} onChange={onChange} labels={labels} /> */}
      </div>
    </div>
  );
};

export default SettingDuration;
