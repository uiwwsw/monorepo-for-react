import Sidebar from '@/Sidebar/index';
import { Outlet } from 'react-router-dom';
import Header from '@/Header';
import { useGetAuth } from '!/auth/application/get-auth';
// import AsyncBoundary from '@/AsyncBoundary';
/* ======   interface   ====== */
/* ======    global     ====== */

const PublicLayout = () => {
  /* ======   variables   ====== */
  const { data } = useGetAuth();
  const isLoggedIn = !!data;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col max-w-full">
        {isLoggedIn && <Header />}
        <main className="flex-auto flex flex-col p-3 max-w-none lg:max-w-[calc(100vw-232px)] 2xl:max-w-fit m-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
