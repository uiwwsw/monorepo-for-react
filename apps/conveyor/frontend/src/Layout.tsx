import { Outlet } from 'react-router-dom';
// import AsyncBoundary from '@/AsyncBoundary';
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('Layout');

const Layout = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <nav className="bg-red-50 basis-28">네비</nav>
      <div className="flex-auto flex flex-col">
        <header className="bg-red-400 sticky top-0 z-50">헤더</header>
        <main className="flex-auto">
          <Outlet />
          {/* <div className="h-[9999px]"></div> */}
        </main>
        <footer className="bg-slate-600">© 2023 semi-ts, Inc. all rights reserved.</footer>
      </div>
    </div>
  );
};

export default Layout;
