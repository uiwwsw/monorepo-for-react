import { createLogger } from '@package-frontend/utils';
import { NavLink as RouterLink, useLocation, NavLinkProps } from 'react-router-dom';
import { GLOBAL_QUERY_PARAM } from '!/routes/domain';
import { MouseEvent } from 'react';
/* ======   interface   ====== */

/* ======    global     ====== */

const logger = createLogger('components/Sidebar/Link');

const Link = (props: NavLinkProps) => {
  /* ======   variables   ====== */
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  const isInIframe = url.has(GLOBAL_QUERY_PARAM['is-iframe']);
  /* ======   function    ====== */
  const handleHref = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    parent.document.location.href = `${props.to}`;
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <span className="relative">
      {isInIframe && <i className="absolute inset-0 cursor-pointer" onClick={handleHref} />}
      <RouterLink {...props} />
    </span>
  );
};

export default Link;
