import Header from '@/Header';
import LayoutWrap from '@/Layout/Wrap';
import LayoutMain from '@/Layout/Main';
// import AsyncBoundary from '@/AsyncBoundary';
/* ======   interface   ====== */
/* ======    global     ====== */

const ErrorLayout = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <LayoutWrap>
      <Header />
      <LayoutMain />
    </LayoutWrap>
  );
};

export default ErrorLayout;
