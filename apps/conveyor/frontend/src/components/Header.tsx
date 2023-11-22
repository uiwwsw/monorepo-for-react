import { createLogger } from '@package-frontend/utils';
import { useHeaderContext } from './HeaderContext';
import { Button } from '@library-frontend/ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetAuth } from '!/auth/application/get-auth';
/* ======   interface   ====== */
export interface HeaderProps {}

/* ======    global     ====== */
const logger = createLogger('components/Header');
const Header = (_: HeaderProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useGetAuth();
  const { children } = useHeaderContext();
  const url = new URLSearchParams(location.search);
  const isInIframe = url.get('side-nav') === 'disabled';

  /* ======   function    ====== */
  const handleLogout = () => navigate('/sign-out');
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <header className="sticky flex items-center top-0 z-10 p-3 bg-slate-300 gap-2">
      <div className="flex-auto">{children}</div>
      <div className="flex gap-2 items-center max-md:flex-col">
        <div>{data?.username}</div>
        <Button smoothLoading themeColor={'secondary'} onClick={handleLogout} disabled={isInIframe}>
          {t('로그아웃')}
        </Button>
      </div>
    </header>
  );
};

export default Header;
