import Sidebar from '@/Sidebar/index';
import { Outlet } from 'react-router-dom';
import { createLogger } from '@package-frontend/utils';
// import AsyncBoundary from '@/AsyncBoundary';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('layout/PublicLayout');

const PublicLayout = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-auto flex flex-col max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
