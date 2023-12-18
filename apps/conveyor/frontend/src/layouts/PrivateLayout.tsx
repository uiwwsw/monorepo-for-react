import Header from '@/Header';
import HeaderContext from '@/HeaderContext';
import { useEffect } from 'react';
// import AsyncBoundary from '@/AsyncBoundary';
import { createLogger } from '@package-frontend/utils';
import { useGetAuth } from '!/auth/application/get-auth';
import { HttpError } from '#/http';
import useHeader from '#/useHeader';
import { useTranslation } from 'react-i18next';
import LayoutWrap from '@/Layout/Wrap';
import LayoutMain from '@/Layout/Main';
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
    <LayoutWrap>
      <HeaderContext.Provider
        value={{
          children,
          setChildren,
        }}
      >
        <Header />
        <LayoutMain />
      </HeaderContext.Provider>
    </LayoutWrap>
  );
};

export default PrivateLayout;
