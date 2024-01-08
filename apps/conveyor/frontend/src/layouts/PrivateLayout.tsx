import Header from '@/Header';
import HeaderContext from '@/HeaderContext';
// import AsyncBoundary from '@/AsyncBoundary';
// import { createLogger } from '@package-frontend/utils';
import initHeader from '#/initHeader';
import LayoutWrap from '@/Layout/Wrap';
import LayoutMain from '@/Layout/Main';
import { useCheckAuth } from '!/auth/application/get-check-auth';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('layout/PrivateLayout');

const PrivateLayout = () => {
  /* ======   variables   ====== */
  // const { t } = useTranslation();
  useCheckAuth();
  // const navigate = useNavigate();
  // const location = useLocation();
  const { children, setChildren } = initHeader();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   logger('useEffect', data);
  //   if (!data) throw new HttpError(t('유저 정보가 없습니다.'), { status: 403 });
  // }, [data]);
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
