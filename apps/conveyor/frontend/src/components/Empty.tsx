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
const Empty = ({ children = '데이터가 없습니다.' }: EmptyProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return <span className={className}>{children === '데이터가 없습니다.' ? t('데이터가 없습니다.') : children}</span>;
};

export default Empty;
