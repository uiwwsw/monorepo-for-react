import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface HeaderProps {}

/* ======    global     ====== */
const logger = createLogger('pages/Header');
const Header = (_: HeaderProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <header className="sticky top-0 z-50 bg-slate-400">스테이터스바</header>;
};

export default Header;
