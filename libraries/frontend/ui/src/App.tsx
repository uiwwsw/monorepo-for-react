/* ======   interface   ====== */

import Checkbox from '@/Checkbox';
import CheckboxGroup from '@/Checkbox/Group';

/* ======    global     ====== */
const App = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <Checkbox></Checkbox>
      <CheckboxGroup defaultChecks={{ '1': true }} labels={['1', '2', '3']} onChange={(e) => console.log(e)} />
    </>
  );
};
export default App;
