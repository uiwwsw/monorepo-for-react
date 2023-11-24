import { createLogger } from '@package-frontend/utils';
import '@package-frontend/pretendard';
import '@package-frontend/noto-emoji';
import ModalWithBtn from '@/Modal/WithBtn';
import Combo from '@/Combo';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  /* ======   useEffect   ====== */
  logger('test');
  return (
    <>
      <ModalWithBtn>
        <Combo options={[{ value: '1', label: 'dddd' }]} />
        dawdawdawdawdawd
      </ModalWithBtn>
    </>
  );
};
export default App;
