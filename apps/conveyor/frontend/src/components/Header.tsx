import { createLogger } from '@package-frontend/utils';
import { useHeaderContext } from './HeaderContext';
import { Button } from '@library-frontend/ui';
import { useNavigate } from 'react-router-dom';
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
  const { data } = useGetAuth();
  const { children } = useHeaderContext();

  /* ======   function    ====== */
  const handleLogout = () => {
    navigate('/sign-out');
    logger('handleLogout');
  };
  /* ======   useEffect   ====== */
  return (
    <header className="sticky top-0 z-10 bg-slate-300 gap-2">
      <div className="max-w-5xl flex items-center p-3 h-20 m-auto">
        <div className="flex-auto">{children}</div>
        <div className="flex gap-2 items-center">
          <div>{data?.userName}</div>
          <Button smoothLoading themeColor={'secondary'} onClick={handleLogout}>
            {t('로그아웃')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
