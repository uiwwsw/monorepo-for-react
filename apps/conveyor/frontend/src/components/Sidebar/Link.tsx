import { createLogger } from '@package-frontend/utils';
import { NavLink as RouterLink, useLocation, NavLinkProps } from 'react-router-dom';
import { GLOBAL_QUERY_PARAM } from '!/routes/domain';
import { MouseEvent } from 'react';
/* ======   interface   ====== */

/* ======    global     ====== */
export type LinkProps = NavLinkProps & {
  commonClassName?: string;
};
const logger = createLogger('components/Sidebar/Link');

const Link = ({ commonClassName, ...props }: LinkProps) => {
  /* ======   variables   ====== */
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  const isInIframe = url.has(GLOBAL_QUERY_PARAM['is-iframe']);
  const isActive = isInIframe && parent.document.location.pathname === props.to;
  const hasError = isInIframe && parent.document.location.pathname === props.to;
  /* ======   function    ====== */
  const handleHref = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    parent.document.location.href = `${props.to}`;
  };
  /* ======   useEffect   ====== */
  logger('render', isActive);
  return (
    <span
      className={`relative [&>*]:block${commonClassName ? ` ${commonClassName}` : ''}${
        isActive ? ` animate-pulse` : ''
      }${hasError ? ' text-red-400' : ''}`}
    >
      {isInIframe && <i className="absolute inset-0 cursor-pointer" onClick={handleHref} />}
      <RouterLink {...props} />
    </span>
  );
};

export default Link;
