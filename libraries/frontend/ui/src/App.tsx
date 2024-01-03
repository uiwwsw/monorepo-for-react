/* ======   interface   ====== */

import Calendar from '@/Calendar';

/* ======    global     ====== */
const App = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <Calendar maxRange={10} selectRange onChange={(e) => console.log(e)}></Calendar>
    </>
  );
};
export default App;
