import { createLogger } from '#/logger';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats');
const Stats = () => {
  /* ======   variables   ====== */
  const navigate = useNavigate();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  useEffect(() => navigate('/stats/summary', { replace: true }));
  return <></>;
};

export default Stats;
