import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');

const Main = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <PageCenter icon="🧑🏻‍💻" title={t('컨베이어 for YMTC')}>
      {t('컨베이어 웹 서비스에 오신걸 환영합니다.')}
    </PageCenter>
  );
};

export default Main;
