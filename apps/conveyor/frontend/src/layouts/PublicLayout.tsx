import Sidebar from '@/Sidebar/index';
import { Outlet } from 'react-router-dom';
import { createLogger } from '@package-frontend/utils';
import Header from '@/Header';
import { useGetAuth } from '!/auth/application/get-auth';
// import AsyncBoundary from '@/AsyncBoundary';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('layout/PublicLayout');

const PublicLayout = () => {
  /* ======   variables   ====== */
  const { data } = useGetAuth();
  const isLoggedIn = !!data;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col max-w-full">
        {isLoggedIn && <Header />}
        <main className="flex-auto flex flex-col p-3 xl:max-w-7xl lg:max-w-3xl m-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
