import { createLogger } from '@package-frontend/utils';
import logo from '$/logo.png';
import { Link, useLocation } from 'react-router-dom';
import GroupLink from './GroupLink';
import { Button, Image } from '@library-frontend/ui';
import { useRef, useState } from 'react';
import { authRoutes, commonRoutes } from 'src/routes';
import Language from './Language';
import { Tutorial } from '@library-frontend/ui';
/* ======   interface   ====== */
export interface NavProps {}

/* ======    global     ====== */

const logger = createLogger('components/Nav');
const Nav = (_: NavProps) => {
  /* ======   variables   ====== */
  const langRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  const isInIframe = url.get('side-nav') === 'disabled';
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
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
              <Image block src={logo} alt="logo" height={37} />
            </Link>
            <hr />
            <GroupLink routes={authRoutes} />
          </div>
          <hr className="border-dashed" />
          <GroupLink routes={commonRoutes} />
        </nav>
        <hr className="border-dashed" />
        <span ref={langRef} className="flex ">
          <Language />
        </span>

        <footer className="text-white text-[10px] p-2 text-center">© 2023 semi-ts, Inc. all rights reserved.</footer>
      </div>
      <Tutorial
        guide={[
          {
            text: '메인으로 이동합니다.',
            position: {
              top: '0',
              left: '0',
            },
            size: {
              width: '208px',
              height: '70px',
            },
          },
          {
            text: '로그인 후 접근 가능한 영역입니다.',
            position: {
              top: '70px',
              left: '0',
            },
            size: {
              width: '208px',
              height: '300px',
            },
          },
          {
            text: '조작페이지는 블라블라 입니다.',
            position: {
              top: '70px',
              left: '0',
            },
            size: {
              width: '208px',
              height: '50px',
            },
          },
          {
            text: '통계페이지는 존, 알람, 케리어 페이지로\n 통계 데이터를 확인할 수 있습니다.',
            position: {
              top: '120px',
              left: '0',
            },
            size: {
              width: '208px',
              height: '134px',
            },
          },
          {
            text: '로그인 필요없는 페이지입니다.',
            position: {
              bottom: '80px',
              left: '0',
            },
            size: {
              width: '208px',
              height: '140px',
            },
          },
          {
            ref: langRef,
            text: '언어 변경이 가능합니다.\n브라우저의 언어를 변경하면 좀 더 완벽한 언어 지원이 가능합니다.(캘린더 등)',
            button: (
              <Button
                themeColor={'secondary'}
                onClick={() => {
                  window.open('https://www.google.com/search?q=How%20to%20change%20browser%20language');
                }}
              >
                브라우저 언어 변경 방법
              </Button>
            ),
          },
        ]}
      />
    </>
  );
};

export default Nav;
