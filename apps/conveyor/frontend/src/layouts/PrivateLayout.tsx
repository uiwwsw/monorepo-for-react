import Header from '@/Header';
import HeaderContext from '@/HeaderContext';
import Sidebar from '@/Sidebar/index';
import { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
import { createLogger } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('layout/PrivateLayout');

const PrivateLayout = () => {
  /* ======   variables   ====== */
  // const navigate = useNavigate();
  // const location = useLocation();
  const [headerSlot, setHeaderSlot] = useState<ReactNode>(undefined);
  useGetAuth();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   logger(data);
  //   if (!data) navigate(`/sign-in?from=${location.pathname}`);
  // }, [data]);
  logger('render');
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col max-w-full">
        <HeaderContext.Provider
          value={{
            children: headerSlot,
            setChildren: setHeaderSlot,
          }}
        >
          <Header />
          <main className="flex-auto flex flex-col p-3 xl:max-w-7xl lg:max-w-3xl m-auto w-full">
            <Outlet />
          </main>
        </HeaderContext.Provider>
      </div>
    </div>
  );
};

export default PrivateLayout;
