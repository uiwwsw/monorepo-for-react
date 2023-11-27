import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
import H1 from './Typography/H1';
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
    <div className="lg:min-w-[500px] p-3 m-auto flex flex-row items-center">
      <div className="flex items-top gap-4 w-full max-lg:flex-col">
        <span className="text-9xl max-lg:text-center">{icon}</span>
        <div className="w-full text-left gap-4 flex flex-col">
          <H1>{title}</H1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageCenter;
