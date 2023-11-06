import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/NotFound');
const NotFound = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <>주소가 잘못됐을거에요 아마... 뒤로가기나 주소를 확인해주세요</>;
};

export default NotFound;
