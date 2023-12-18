// import { createLogger } from '@package-frontend/utils';
import ScrollTop from '@/ScrollTop';
import { Outlet } from 'react-router-dom';

/* ======   interface   ====== */
export interface LayoutMainProps {}

/* ======    global     ====== */
// const logger = createLogger('components/Layout/Main');
const LayoutMain = (_: LayoutMainProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <main className="flex-auto flex flex-col p-3 max-w-fit max-lg:max-w-full m-auto w-full">
      <ScrollTop />
      <Outlet />
    </main>
  );
};

export default LayoutMain;
