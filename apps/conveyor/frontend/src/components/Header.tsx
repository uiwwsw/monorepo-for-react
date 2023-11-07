import { createLogger } from '@package-frontend/utils';
import { useHeaderContext } from './HeaderContext';
import { Button, ToastWithPortal } from '@library-frontend/ui';
import { useCheckAuth } from '!/auth/application/check-auth';
import { useSignout } from '!/auth/application/sign-out';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
/* ======   interface   ====== */
export interface HeaderProps {}

/* ======    global     ====== */
const logger = createLogger('components/Header');
const Header = (_: HeaderProps) => {
  /* ======   variables   ====== */
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useCheckAuth();
  const { children } = useHeaderContext();
  const { trigger, error } = useSignout();
  const url = new URLSearchParams(location.search);
  const isInIframe = url.get('side-nav') === 'disabled';
  // const pageTitle = useMemo(() => {
  //   const current = authRoutes.find((x) => `/${x.path}` === location.pathname);
  //   if (!current) return '';

  //   return `${current.icon} ${current.name}`;
  // }, [location]);
  /* ======   function    ====== */
  const handleLogout = async () => {
    await trigger();
    navigate('/');
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <header className="sticky flex items-center top-0 h-24 z-10 p-3 bg-slate-400 gap-2">
      <ToastWithPortal duration={1000} open={error}>
        로그인에 실패했습니다.
      </ToastWithPortal>
      <div className="flex-auto">{children}</div>
      <div>{data?.name}</div>
      <Button smoothLoading themeColor={'secondary'} onClick={handleLogout} disabled={isInIframe}>
        로그아웃
      </Button>
    </header>
  );
};

export default Header;
