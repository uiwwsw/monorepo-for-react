import PageCenter from '@/PageCenter';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/NotFound');
const NotFound = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <PageCenter icon="😜" title="페이지를 찾을 수 없어요.">
      <p className="">주소를 확인해주세요</p>
    </PageCenter>
  );
};

export default NotFound;
