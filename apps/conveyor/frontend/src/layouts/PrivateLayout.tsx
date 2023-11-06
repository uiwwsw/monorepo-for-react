import { Auth } from '!/auth/domain';
import Header from '@/Header';
import HeaderContext from '@/HeaderContext';
import Sidebar from '@/Sidebar';
import { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('layout/PrivateLayout');

const PrivateLayout = () => {
  /* ======   variables   ====== */
  const [headerSlot, setHeaderSlot] = useState<ReactNode>(undefined);
  const [auth, setAuth] = useState<Auth | undefined>(undefined);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col">
        <HeaderContext.Provider
          value={{
            children: headerSlot,
            setChildren: setHeaderSlot,
            auth,
            setAuth,
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
