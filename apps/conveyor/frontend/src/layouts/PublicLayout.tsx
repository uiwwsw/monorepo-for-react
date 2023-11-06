import Header from '@/Header';
import Sidebar from '@/Sidebar';
import { Outlet } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('PublicLayout');

const PublicLayout = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col">
        <main className="flex-auto p-3 max-w-5xl m-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
