import PageCenter from '@/PageCenter';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');

const Main = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <PageCenter icon="🧑🏻‍💻" title="컨베이어 for YMTC">
      컨베이어 웹 서비스에 오신걸 환영합니다.
    </PageCenter>
  );
};

export default Main;
