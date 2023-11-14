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
    <div className="min-h-screen md:w-[500px] p-3 m-auto flex flex-row items-center">
      <div className="flex items-top gap-4 w-full max-md:flex-col">
        <span className="text-9xl max-md:text-center">{icon}</span>
        <div className="w-full text-left gap-4 flex flex-col">
          <h1 className="text-2xl font-bold first-letter:uppercase">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageCenter;
