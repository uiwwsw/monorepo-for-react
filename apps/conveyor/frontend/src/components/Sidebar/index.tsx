import { LocalStorage, createLogger } from '@package-frontend/utils';
import logo from '$/logo.png';
import GroupLink from './GroupLink';
import Link from './Link';
import { Button, Image, Tutorial } from '@library-frontend/ui';
import { useEffect, useRef, useState } from 'react';
import { authRoutes, commonRoutes } from 'src/routes';
import Language from './Language';
/* ======   interface   ====== */
export interface NavProps {}

/* ======    global     ====== */

const logger = createLogger('components/Nav');

const Nav = (_: NavProps) => {
  /* ======   variables   ====== */
  const langRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const guide = [
    // {
    //   text: '메인으로 이동합니다.',
    //   position: {
    //     top: '0',
    //     left: '0',
    //   },
    //   size: {
    //     width: '208px',
    //     height: '70px',
    //   },
    // },
    // {
    //   text: '로그인 후 접근 가능한 영역입니다.',
    //   position: {
    //     top: '70px',
    //     left: '0',
    //   },
    //   size: {
    //     width: '208px',
    //     height: '300px',
    //   },
    // },
    {
      text: '조작페이지는 TCM장비를 조작하는 페이지입니다.',
      position: {
        top: '82px',
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
        top: '130px',
        left: '0',
      },
      size: {
        width: '208px',
        height: '110px',
      },
    },
    // {
    //   text: '로그인 필요없는 페이지입니다.',
    //   position: {
    //     bottom: '80px',
    //     left: '0',
    //   },
    //   size: {
    //     width: '208px',
    //     height: '140px',
    //   },
    // },
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
    {
      text: '처음 접속하셨다면 회원가입 후 로그인해보세요~',
      position: {
        bottom: '80px',
        left: '0',
      },
      size: {
        width: '208px',
        height: '126px',
      },
    },
  ];
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    const id = LocalStorage.get(`tutorial-"${guide.map((x) => x.text.replace(/\n/g, '\\n')).join('/')}"`);
    setOpen(!id);
  }, []);
  logger('render');
  return (
    <>
      <div
        className={`transition-transform lg:sticky lg:translate-x-0 max-lg:fixed -translate-x-full z-20 flex flex-col top-0 flex-shrink-0 basis-52 bg-gray-700 text-slate-200 h-screen shadow-2xl${
          open ? ' !translate-x-0' : ''
        }`}
        onClick={() => open && setOpen(false)}
      >
        <Button
          onClick={() => setOpen(true)}
          className={`!fixed w-10 h-10 bg-gray-700 left-full lg:invisible`}
          themeColor={null}
          themeSize={null}
        >
          {open ? '🗞️' : '📰'}
        </Button>
        <nav className="flex flex-col flex-auto">
          <div className="flex-auto" onClick={() => logger('1')}>
            <Link to="/" className="flex p-4 h-20 justify-center" onClick={() => logger('2')}>
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
      <Tutorial guide={guide} />
    </>
  );
};

export default Nav;
