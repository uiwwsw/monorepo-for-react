import { createLogger } from '@package-frontend/utils';
import { useEffect, useState } from 'react';
/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('utils/useAnimate');
const useAnimate = () => {
  /* ======   variables   ====== */
  const [animate, setAnimate] = useState(false);
  const listener = () => setAnimate(false);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger(`useEffect: animate = ${animate}`);
    if (animate) window.addEventListener('animationend', listener);
    return () => window.removeEventListener('animationend', listener);
  }, [animate]);
  return {
    animate,
    setAnimate,
  };
};

export default useAnimate;
