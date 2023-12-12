import Header from '@/Header';
import HeaderContext from '@/HeaderContext';
import Sidebar from '@/Sidebar/index';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
import { createLogger } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
import { HttpError } from '#/http';
import useHeader from '#/useHeader';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('layout/PrivateLayout');

const PrivateLayout = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  // const navigate = useNavigate();
  // const location = useLocation();
  const { children, setChildren } = useHeader();
  const { data } = useGetAuth();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect', data);
    if (!data) throw new HttpError(t('유저 정보가 없습니다.'), { status: 403 });
  }, [data]);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col max-w-full">
        <HeaderContext.Provider
          value={{
            children,
            setChildren,
          }}
        >
          <Header />
          <main className="flex-auto flex flex-col p-3 max-w-none lg:max-w-[calc(100vw-232px)] 2xl:max-w-fit m-auto w-full">
            <Outlet />
          </main>
        </HeaderContext.Provider>
      </div>
    </div>
  );
};

export default PrivateLayout;
