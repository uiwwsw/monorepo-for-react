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
    <div className="flex min-h-screen">
      <nav className="bg-red-50">네비</nav>
      <div>
        <header className="bg-red-400">헤더</header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
