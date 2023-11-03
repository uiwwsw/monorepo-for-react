import { createLogger } from '@package-frontend/utils';
import '@package-frontend/pretendard';
import '@package-frontend/noto-emoji';
import { useState } from 'react';
// import ModalWithPortal from '@/Modal/WithPortal';
// import ModalWithBtn from '@/Modal/WithBtn';
import ToastWithBtn from '@/Toast/WithBtn';
import ToastWithPortal from '@/Toast/WithPortal';
import Calendar from '@/Calendar';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  // 본인이 개발한 컴포넌트를 개발해보고 이 페이지는 커밋하지 않습니다.
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('test');
  return (
    <div className="p-10">
      <button onClick={() => setOpen(true)}>dawdw</button>
      <ToastWithBtn>dawdaw</ToastWithBtn>
      <ToastWithPortal open={open} onClose={() => setOpen(false)}>
        dawdaw
      </ToastWithPortal>
      <Calendar />
    </div>
  );
};
export default App;
