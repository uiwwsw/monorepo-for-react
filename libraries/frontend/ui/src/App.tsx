import { createLogger } from '@package-frontend/utils';
import Pagination from '@/Pagination';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  /* ======   useEffect   ====== */
  logger('test');

  return (
    <>
      <Pagination max={10} onChange={(e) => logger(e)} />
    </>
  );
};
export default App;
