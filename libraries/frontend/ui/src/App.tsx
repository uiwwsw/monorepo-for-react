/* ======   interface   ====== */

import Button from '@/Button';
import Calendar from '@/Calendar';
import { useState } from 'react';

/* ======    global     ====== */
const App = () => {
  /* ======   variables   ====== */
  const [value, setValue] = useState<string[]>(['2020-01-02T00:00:00', '2020-01-03T00:00:00']);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <Button>dawdawd</Button>
      <button onClick={() => setValue(['2017-01-02T00:00:00', '2017-01-03T00:00:00'])}>dawda</button>
      <button onClick={() => setValue(['2018-01-02T00:00:00', '2018-01-03T00:00:00'])}>dawda</button>
      <Calendar defaultValue={value} selectRange></Calendar>
    </>
  );
};
export default App;
