import { createLogger } from '@package-frontend/utils';
import '@package-frontend/pretendard';
import '@package-frontend/noto-emoji';
import Calendar from '@/Calendar';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  /* ======   useEffect   ====== */
  logger('test');
  return (
    <>
      <Calendar defaultValue={'2017-01-01'}></Calendar>
    </>
  );
};
export default App;
