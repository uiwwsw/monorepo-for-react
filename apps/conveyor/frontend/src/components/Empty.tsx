// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface EmptyProps {
  children?: ReactNode;
}

/* ======    global     ====== */
// const logger = createLogger('components/Empty');
const className = 'text-gray-200';
export const emptyClassName = 'empty:text-gray-200 empty:after:content-["EMPTY"]';
const Empty = ({ children = '빈값' }: EmptyProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return <span className={className}>{children === '빈값' ? t('빈값') : children}</span>;
};

export default Empty;
