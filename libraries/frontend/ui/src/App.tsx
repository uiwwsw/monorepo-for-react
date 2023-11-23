import { createLogger } from '@package-frontend/utils';
import '@package-frontend/pretendard';
import '@package-frontend/noto-emoji';
import Button from '@/Button';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  /* ======   useEffect   ====== */
  logger('test');
  return (
    <>
      <Button themeColor={'quaternary'}>버튼</Button>
    </>
  );
};
export default App;
