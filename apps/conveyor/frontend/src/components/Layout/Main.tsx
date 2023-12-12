// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

/* ======   interface   ====== */
export interface LayoutMainProps {
  children?: ReactNode;
}

/* ======    global     ====== */
// const logger = createLogger('components/Layout/Main');
const LayoutMain = ({ children }: LayoutMainProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <main className="flex-auto flex flex-col p-3 max-w-none lg:max-w-[calc(100vw-232px)] 2xl:max-w-fit m-auto w-full">
      <Outlet />
    </main>
  );
};

export default LayoutMain;
