import Header from '@/Header';
import Sidebar from '@/Sidebar';
import { Outlet } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('NormalLayout');

const NormalLayout = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col">
        <Header />
        <main className="flex-auto">
          <Outlet />
          {/* <div className="h-[9999px]"></div> */}
        </main>
      </div>
    </div>
  );
};

export default NormalLayout;
