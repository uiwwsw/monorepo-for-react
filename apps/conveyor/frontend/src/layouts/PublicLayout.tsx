import Header from '@/Header';
import { useGetAuth } from '!/auth/application/get-auth';
import LayoutWrap from '@/Layout/Wrap';
import LayoutMain from '@/Layout/Main';
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
    <LayoutWrap>
      {isLoggedIn && <Header />}
      <LayoutMain />
    </LayoutWrap>
  );
};

export default PublicLayout;
