import { createLogger } from '@package-frontend/utils';
import '@package-frontend/pretendard';
import '@package-frontend/noto-emoji';
import Calendar from '@/Calendar';
import Select from '@/Select';
import Combo from '@/Combo';
// import ModalWithPortal from '@/Modal/WithPortal';
// import ModalWithBtn from '@/Modal/WithBtn';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  // 본인이 개발한 컴포넌트를 개발해보고 이 페이지는 커밋하지 않습니다.
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('test');
  return (
    <div className="p-10">
      <Calendar />
      <Select
        placeholder="시간"
        options={Array(24)
          .fill(null)
          .map((_, x) => ({ label: `${x}시`, value: `${x}` }))}
      />
      <br />
      <Combo
        defaultValue="0"
        placeholder="시간"
        options={Array(24)
          .fill(null)
          .map((_, x) => ({ label: `${x}시`, value: `${x}` }))}
      />
    </div>
  );
};
export default App;
