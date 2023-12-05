import useSocket from '#/useSocket';
import DataContext from '@/DataContext';
import Pages from 'src/Pages';
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('App');

const App = () => {
  /* ======   variables   ====== */
  const { data } = useSocket('ZONE_GET_INFO');
  // const t = import.meta.env.VITE_APP
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <DataContext.Provider value={{ data }}>
      <Pages />
    </DataContext.Provider>
  );
};

export default App;
