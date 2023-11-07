import { createLogger } from '@package-frontend/utils';
import { useHeaderContext } from './HeaderContext';
import { Button } from '@library-frontend/ui';
import { useCheckAuth } from '!/auth/application/check-auth';
import { useSignout } from '!/auth/application/sign-out';
/* ======   interface   ====== */
export interface HeaderProps {}

/* ======    global     ====== */
const logger = createLogger('components/Header');
const Header = (_: HeaderProps) => {
  /* ======   variables   ====== */
  // const location = useLocation();
  const { data } = useCheckAuth();
  const { trigger } = useSignout();
  const { children } = useHeaderContext();
  // const pageTitle = useMemo(() => {
  //   const current = authRoutes.find((x) => `/${x.path}` === location.pathname);
  //   if (!current) return '';

  //   return `${current.icon} ${current.name}`;
  // }, [location]);
  /* ======   function    ====== */
  const handleLogout = () => trigger();
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <header className="sticky flex items-center top-0 h-24 z-10 p-3 bg-slate-400 gap-2">
      {/* <div className="text-black text-xl">{pageTitle}</div> */}
      <div className="flex-auto">{children}</div>
      <div>{data?.name}</div>
      <Button smoothLoading themeColor={'secondary'} onClick={handleLogout}>
        로그아웃
      </Button>
    </header>
  );
};

export default Header;
