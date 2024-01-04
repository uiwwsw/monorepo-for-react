import { getScrollbarHeight } from '@package-frontend/utils';
import logo from '$/logo.png';
import GroupLink from './GroupLink';
import Link from './Link';
import { Button, Image } from '@library-frontend/ui';
import { useRef, useState } from 'react';
import { authRoutes, commonRoutes } from 'src/routes';
import Language from './Language';
import Test from '@/Test';
import { Emoji } from '@library-frontend/ui';
/* ======   interface   ====== */
export interface NavProps {}

/* ======    global     ====== */

// const logger = createLogger('components/Nav');

const Nav = (_: NavProps) => {
  /* ======   variables   ====== */
  const scrollBarHeight = getScrollbarHeight();
  const langRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   logger('useEffect');
  // }, []);
  return (
    <div
      className={`transition-transform lg:sticky lg:translate-x-0 max-lg:fixed -translate-x-full z-20 flex flex-col top-0 flex-shrink-0 basis-52 bg-gray-700 text-slate-200 shadow-2xl${
        open ? ' !translate-x-0' : ''
      }`}
      style={{ height: `calc(100vh - ${scrollBarHeight}px)` }}
    >
      <Button
        onClick={() => setOpen(!open)}
        className={`!fixed w-10 h-10 bg-gray-700 left-full lg:invisible`}
        themeColor={null}
        themeSize={null}
      >
        <Emoji>{open ? '🗞️' : '📰'}</Emoji>
      </Button>
      <nav className="flex flex-col flex-auto" onClick={() => setOpen(false)}>
        <div className="flex-auto">
          <Link to="/" className="flex p-4 h-20 justify-center">
            <Image src={logo} alt="SEMI-TS" height={48} />
          </Link>
          <hr />
          <GroupLink routes={authRoutes} />
        </div>
        <hr className="border-dashed" />
        <GroupLink routes={commonRoutes} />
      </nav>
      <hr className="border-dashed" />
      <span ref={langRef} className="flex">
        <Test>
          <Language />
        </Test>
      </span>

      <footer className="text-white text-[10px] p-2 text-center">© 2023 SEMI-TS, Inc. all rights reserved.</footer>
    </div>
  );
};

export default Nav;
