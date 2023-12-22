import { createLogger } from '@package-frontend/utils';
import { useMemo } from 'react';
import Button from '@/Button';

/* ======   interface   ====== */
export interface NavigationProps {
  onClick?: (route: string) => unknown;
}
/* ======    global     ====== */
const logger = createLogger('components/Navigation');
const Navigation = ({ onClick }: NavigationProps) => {
  /* ======   variables   ====== */
  const { pathname } = location;
  const paths = useMemo(() => pathname.split('/').filter((x) => x), [pathname]);
  /* ======   function    ====== */
  const handleClick = (i: number) => {
    onClick && onClick('/' + paths.slice(0, i + 1).join('/'));
    logger('handleClick');
  };
  /* ======   useEffect   ====== */
  return (
    <div className="flex items-center h-full px-3 gap-3">
      {paths.map((x, i) => (
        <div key={'navigation' + x + i}>
          {i > 0 ? <span className="mr-3">/</span> : ''}
          <Button disabled={i === paths.length - 1} data-theme="secondary" onClick={() => handleClick(i)}>
            {x}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Navigation;
