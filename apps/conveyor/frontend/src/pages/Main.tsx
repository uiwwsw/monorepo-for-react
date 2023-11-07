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
    <>
      <p>control 페이지는 tcm dwadwd, dawd aw를 조정할 수 있습니다.</p>
      <p>statistics 페이지는 그래프등을 볼 수 있습니다.</p>
    </>
  );
};

export default Main;
