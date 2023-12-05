import Header from '@/Header';
import HeaderContext from '@/HeaderContext';
import Sidebar from '@/Sidebar/index';
import { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
import { useGetAuth } from '!/auth/application/get-auth';
import { Loading } from '@library-frontend/ui';
import { ToastWithPortal } from '@library-frontend/ui';
/* ======   interface   ====== */
/* ======    global     ====== */

const PrivateLayout = () => {
  /* ======   variables   ====== */
  // const navigate = useNavigate();
  // const location = useLocation();
  const { data } = useGetAuth();
  const [headerSlot, setHeaderSlot] = useState<ReactNode>(undefined);
  const invalidSession = !data;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   logger(data);
  //   if (!data) navigate(`/sign-in?from=${location.pathname}`);
  // }, [data]);

  return (
    <>
      <ToastWithPortal open={invalidSession} duration={Infinity}>
        로그인 정보를 읽어올 수 없습니다.
      </ToastWithPortal>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className={`flex-auto flex flex-col max-w-full${invalidSession ? ' relative' : ''}`}>
          <HeaderContext.Provider
            value={{
              children: headerSlot,
              setChildren: setHeaderSlot,
            }}
          >
            <Header />
            <main className="flex-auto flex flex-col p-3 xl:max-w-7xl lg:max-w-3xl m-auto w-full">
              <Loading show={invalidSession} className="absolute" />
              <Outlet />
            </main>
          </HeaderContext.Provider>
        </div>
      </div>
    </>
  );
};

export default PrivateLayout;
