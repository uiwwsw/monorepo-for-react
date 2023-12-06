import { createLogger } from '@package-frontend/utils';
import ToastWithPortal from '@/Toast/WithPortal';
import { useEffect, useState } from 'react';
import useToasts from '#/useToasts';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  const { Toasts, showToast } = useToasts();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('test');
  useEffect(() => {
    showToast({ message: 1 });
    showToast({ message: 2 });
  }, []);
  return (
    <>
      <Toasts />
    </>
  );
};
export default App;
