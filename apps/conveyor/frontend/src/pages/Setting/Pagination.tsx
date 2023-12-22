import { Numeric } from '@library-frontend/ui';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

/* ======   interface   ====== */
export interface SettingPaginationProps {
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}
/* ======    global     ====== */
const SettingPagination = ({ label, onChange, value }: SettingPaginationProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex items-center">
      <span className="text-lg">{label}</span>:
      <div className="ml-3">
        <Numeric placeholder={t('페이지 갯수를 입력해주세요.')} min={5} max={100} value={value} onChange={onChange} />
        {/* <RadioGroup id={label} defaultValue={defaultValue} onChange={onChange} labels={labels} /> */}
      </div>
    </div>
  );
};

export default SettingPagination;
