import { createLogger } from '@package-frontend/utils';
import { useHeaderContext } from './HeaderContext';
import { Button } from '@library-frontend/ui';
import { useLocation } from 'react-router-dom';
import { authRoutes } from '../routes';
import { useMemo } from 'react';
/* ======   interface   ====== */
export interface HeaderProps {}

/* ======    global     ====== */
const logger = createLogger('components/Header');
const Header = (_: HeaderProps) => {
  /* ======   variables   ====== */
  // const location = useLocation();
  const { children } = useHeaderContext();
  // const pageTitle = useMemo(() => {
  //   const current = authRoutes.find((x) => `/${x.path}` === location.pathname);
  //   if (!current) return '';

  //   return `${current.icon} ${current.name}`;
  // }, [location]);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <header className="sticky flex items-center top-0 h-24 z-10 p-3 bg-slate-400 gap-2">
      {/* <div className="text-black text-xl">{pageTitle}</div> */}
      <div className="flex-auto">{children}</div>
      <div>유저이름</div>
      <Button themeColor={'secondary'}>로그아웃</Button>
    </header>
  );
};

export default Header;
