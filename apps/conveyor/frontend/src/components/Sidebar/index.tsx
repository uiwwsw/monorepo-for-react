import { createLogger } from '@package-frontend/utils';
import logo from '$/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { authRoutes, commonRoutes } from '../../routes';
import GroupLink from './GroupLink';
import { Button } from '@library-frontend/ui';
import { useState } from 'react';

/* ======   interface   ====== */
export interface NavProps {}

/* ======    global     ====== */
export let sideWidth = 210;
const logger = createLogger('components/Nav');
const Nav = (_: NavProps) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  const isInIframe = url.get('side-nav') === 'disabled';
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div
      className={`transition-transform md:sticky md:translate-x-0 max-md:fixed -translate-x-full z-20 flex flex-col top-0 flex-shrink-0 basis-52 bg-gray-700 text-slate-200 h-screen shadow-2xl${
        isInIframe ? ' cursor-not-allowed' : ''
      }${open ? ' !translate-x-0' : ''}`}
      onClick={() => open && setOpen(false)}
    >
      <Button
        onClick={() => setOpen(true)}
        className={`!fixed w-10 h-10 bg-gray-700 left-full md:invisible`}
        themeColor={null}
        themeSize={null}
      >
        {open ? '🗞️' : '📰'}
      </Button>
      <nav className={`flex flex-col flex-auto${isInIframe ? ' pointer-events-none' : ''}`}>
        <div className="flex-auto">
          <Link to="/" className="block p-4">
            <img src={logo} alt="Logo" className="block w-32 m-auto" />
          </Link>
          <hr />
          <GroupLink routes={authRoutes} />
        </div>
        <hr className="border-dashed" />
        <GroupLink routes={commonRoutes} />
      </nav>
      <hr />
      <footer className="text-white text-[10px] p-2 pt-0 text-center">
        © 2023 semi-ts, Inc. all rights reserved.
      </footer>
    </div>
  );
};

export default Nav;
