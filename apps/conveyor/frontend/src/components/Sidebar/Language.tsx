import { Select } from '@library-frontend/ui';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface LanguageProps {}
/* ======    global     ====== */

const logger = createLogger('components/Language');
const Language = (_: LanguageProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const options = [
    { value: 'ko', label: t('한글') },
    { value: 'en-US', label: t('영어') },
    { value: 'zh-CN', label: t('중국어') },
  ];
  const value = LocalStorage.get<string>('i18nextLng');
  const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    LocalStorage.set('i18nextLng', target.value);
    location.reload();
  };
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render', value);
  return (
    <Select options={options} onChange={handleChange} defaultValue={value} placeholder={t('언어를 선택해 주세요.')} />
  );
};

export default Language;
