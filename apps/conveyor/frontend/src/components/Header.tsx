import { createLogger } from '@package-frontend/utils';
import { useHeaderContext } from './HeaderContext';
import { Button, ToastWithPortal } from '@library-frontend/ui';
import { useCheckAuth } from '!/auth/application/check-auth';
import { useSignout } from '!/auth/application/sign-out';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface HeaderProps {}

/* ======    global     ====== */
const logger = createLogger('components/Header');
const Header = (_: HeaderProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useCheckAuth();
  const { children } = useHeaderContext();
  const url = new URLSearchParams(location.search);
  const isInIframe = url.get('side-nav') === 'disabled';

  /* ======   function    ====== */
  const handleLogout = () => navigate('/sign-out');
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <header className="sticky flex items-center top-0 h-24 z-10 p-3 bg-slate-400 gap-2">
      <div className="flex-auto">{children}</div>
      <div>{data?.name}</div>
      <Button smoothLoading themeColor={'secondary'} onClick={handleLogout} disabled={isInIframe}>
        {t('로그아웃')}
      </Button>
    </header>
  );
};

export default Header;
