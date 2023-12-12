// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
import Sidebar from '@/Sidebar/index';
/* ======   interface   ====== */
export interface LayoutWrapProps {
  children?: ReactNode;
}

/* ======    global     ====== */
// const logger = createLogger('components/Layout/Wrap');
const LayoutWrap = ({ children }: LayoutWrapProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col max-lg:max-w-full">{children}</div>
    </div>
  );
};

export default LayoutWrap;
