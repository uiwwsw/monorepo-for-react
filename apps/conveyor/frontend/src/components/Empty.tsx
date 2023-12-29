// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface EmptyProps {
  children?: ReactNode;
  className?: string;
}

/* ======    global     ====== */
// const logger = createLogger('components/Empty');
export const emptyClassName = 'empty:text-gray-200 empty:after:content-["EMPTY"]';
const Empty = ({ children = '데이터가 없습니다.', className }: EmptyProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <span className={`text-gray-200${className ? ` ${className}` : ''}`}>
      {children === '데이터가 없습니다.' ? t('데이터가 없습니다.') : children}
    </span>
  );
};

export default Empty;
