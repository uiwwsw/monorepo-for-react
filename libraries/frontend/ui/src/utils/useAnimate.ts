import { useEffect, useState } from 'react';
/* ======   interface   ====== */
/* ======    global     ====== */

const useAnimate = () => {
  /* ======   variables   ====== */
  const [animate, setAnimate] = useState(false);
  const listener = () => setAnimate(false);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (animate) window.addEventListener('animationend', listener);
    return () => window.removeEventListener('animationend', listener);
  }, [animate]);
  return {
    animate,
    setAnimate,
  };
};

export default useAnimate;
