import { createLogger } from '#/logger';
import ToastWithPortal from '@/Toast/WithPortal';
import { useState } from 'react';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('test');

  return (
    <>
      <button onClick={() => setA(true)}>1</button>
      <button onClick={() => setB(true)}>2</button>
      <button onClick={() => setC(true)}>3</button>
      <ToastWithPortal open={a}>dawdawd</ToastWithPortal>
      <ToastWithPortal open={a} duration={10000}>
        dawdawd
      </ToastWithPortal>
      <ToastWithPortal open={b} notClose>
        dawdawd
      </ToastWithPortal>
      <ToastWithPortal open={c} duration={10000} notClose hasGauge>
        dawdawd
      </ToastWithPortal>
    </>
  );
};
export default App;
