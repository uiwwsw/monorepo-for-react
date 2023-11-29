import PageCenter from '@/PageCenter';
import { Accordion, Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Error');
const Error = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const location = useLocation();
  /* ======   function    ====== */
  const handleRefresh = () => (parent.document.location.href = parent.document.location.href);
  const handleGoMain = () => (parent.document.location.href = '/');
  /* ======   useEffect   ====== */
  logger('render', location);
  return (
    <>
      <PageCenter icon="😧" title={t('오류가 발생했어요')}>
        <Accordion title={t('오류 코드 또는 오류 메세지')}>{decodeURI(location.hash).replace('#', '')}</Accordion>
        <div className="gap-3 flex m-auto">
          <Button onClick={handleGoMain}>{t('메인으로 돌아가기')}</Button>
          <Button themeColor={'secondary'} onClick={handleRefresh}>
            {t('새로고침')}
          </Button>
        </div>
      </PageCenter>
    </>
  );
};

export default Error;
