import PageCenter from '@/PageCenter';
import { createLogger } from '#/logger';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/NotFound');
const NotFound = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <PageCenter icon="😜" title={t('페이지를 찾을 수 없어요.')}>
      <p>{t('주소를 확인해주세요.')}</p>
    </PageCenter>
  );
};

export default NotFound;
