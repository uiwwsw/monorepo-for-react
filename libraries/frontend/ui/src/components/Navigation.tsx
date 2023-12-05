import { createLogger } from '#/logger';
import { useMemo } from 'react';
import Button from '@/Button';
import { WithEval } from '#/componentTypes';

/* ======   interface   ====== */
export interface NavigationProps extends WithEval<string> {}
/* ======    global     ====== */
const logger = createLogger('components/Navigation');
const Navigation = ({ onEval }: NavigationProps) => {
  /* ======   variables   ====== */
  const { pathname } = location;
  const paths = useMemo(() => pathname.split('/').filter((x) => x), [pathname]);
  /* ======   function    ====== */
  const handleClick = (i: number) => onEval && onEval('/' + paths.slice(0, i + 1).join('/'));
  /* ======   useEffect   ====== */
  logger('render');
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
