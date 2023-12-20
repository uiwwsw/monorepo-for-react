/* ======   interface   ====== */

import Select from '@/Select';

/* ======    global     ====== */
const App = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <Select pl={40} prefix={<span className="absolute pl-3">🌐</span>} options={[{ value: '1', label: 'adw' }]} />
    </>
  );
};
export default App;
