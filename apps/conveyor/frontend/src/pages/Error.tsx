import PageCenter from '@/PageCenter';
import { Accordion, Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useLocation } from 'react-router-dom';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Error');
const Error = () => {
  /* ======   variables   ====== */
  const location = useLocation();
  /* ======   function    ====== */
  const handleRefresh = () => (parent.document.location.href = parent.document.location.href);
  const handleGoMain = () => (parent.document.location.href = '/');
  /* ======   useEffect   ====== */
  logger('render', location);
  return (
    <PageCenter icon="😧" title="오류가 발생했어요">
      <Accordion title="오류 코드">{decodeURI(location.hash).replace('#', '')}</Accordion>
      <div className="gap-3 flex m-auto">
        <Button onClick={handleRefresh}>새로고침</Button>
        <Button themeColor={'secondary'} onClick={handleGoMain}>
          메인으로 돌아가기
        </Button>
      </div>
    </PageCenter>
  );
};

export default Error;
