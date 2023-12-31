import Header from '@/Header';
import LayoutWrap from '@/Layout/Wrap';
import LayoutMain from '@/Layout/Main';
import { useGetHealth } from '!/server/application/get-health';
// import AsyncBoundary from '@/AsyncBoundary';
/* ======   interface   ====== */
/* ======    global     ====== */

const PublicLayout = () => {
  /* ======   variables   ====== */
  useGetHealth();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <LayoutWrap>
      <Header />
      <LayoutMain />
    </LayoutWrap>
  );
};

export default PublicLayout;
