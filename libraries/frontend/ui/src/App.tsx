/* ======   interface   ====== */

import useCounter from '#/useCounter';
import { useEffect } from 'react';

/* ======    global     ====== */
const App = () => {
  /* ======   variables   ====== */
  const { increase, onStart } = useCounter(5);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    onStart();
  }, []);
  return <>{increase}</>;
};
export default App;
