import Header from '@/Header';
import HeaderContext from '@/HeaderContext';
import Sidebar from '@/Sidebar/index';
import { ReactNode, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
import { createLogger } from '@package-frontend/utils';
import { useCheckAuth } from '!/auth/application/check-auth';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('layout/PrivateLayout');

const PrivateLayout = () => {
  /* ======   variables   ====== */
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useCheckAuth();
  const [headerSlot, setHeaderSlot] = useState<ReactNode>(undefined);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger(data);
    if (!data) navigate(`/sign-in?from=${location.pathname}`);
  }, [data]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col">
        <HeaderContext.Provider
          value={{
            children: headerSlot,
            setChildren: setHeaderSlot,
          }}
        >
          <Header />
          <main className="flex-auto p-3 max-w-5xl m-auto w-full">
            <Outlet />
          </main>
        </HeaderContext.Provider>
      </div>
    </div>
  );
};

export default PrivateLayout;
