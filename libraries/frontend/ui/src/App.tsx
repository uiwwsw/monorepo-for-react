/* ======   interface   ====== */

import Button from '@/Button';
import ModalWithBtn from '@/Modal/WithBtn';
import { useState } from 'react';

/* ======    global     ====== */
const App = () => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(0);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <ModalWithBtn closeTick={open}>
        <Button onClick={() => setOpen(open + 1)}>dawdawd</Button>
      </ModalWithBtn>
    </>
  );
};
export default App;
