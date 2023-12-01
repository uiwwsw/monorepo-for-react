import { createLogger } from '@package-frontend/utils';
import RadioGroup from '@/Radio/Group';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  /* ======   useEffect   ====== */
  logger('test');

  return (
    <>
      <RadioGroup labels={['1', '2', '3']} defaultValue="1" />
    </>
  );
};
export default App;
