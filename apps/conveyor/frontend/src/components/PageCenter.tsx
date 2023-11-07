import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';

/* ======   interface   ====== */
export interface PageCenterProps {
  children?: ReactNode;
  icon?: string;
  title?: string;
}

/* ======    global     ====== */
const logger = createLogger('components/PageCenter');
const PageCenter = ({ title, children, icon }: PageCenterProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="min-h-screen max-w-5xl p-3 m-auto flex flex-row items-center">
      <div className="flex items-top gap-4">
        <span className="text-9xl">{icon}</span>
        <div className="w-full text-left gap-4 flex flex-col">
          <h1 className="text-2xl font-bold ">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageCenter;
