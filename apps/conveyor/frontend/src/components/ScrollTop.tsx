import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
/* ======   interface   ====== */
/* ======    global     ====== */

const ScrollTop = () => {
  /* ======   variables   ====== */

  const { pathname } = useLocation();

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollTop;
