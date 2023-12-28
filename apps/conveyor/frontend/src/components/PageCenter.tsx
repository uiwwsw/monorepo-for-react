import { ReactNode } from 'react';
import H1 from './Typography/H1';
import { Emoji } from '@library-frontend/ui';
/* ======   interface   ====== */
export interface PageCenterProps {
  children?: ReactNode;
  icon?: string;
  title?: string;
}

/* ======    global     ====== */
// const logger = createLogger('components/PageCenter');
const PageCenter = ({ title, children, icon }: PageCenterProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="lg:min-w-[500px] p-3 m-auto flex flex-row items-center">
      <div className="flex items-top gap-4 w-full max-lg:flex-col">
        <Emoji className="text-9xl max-lg:text-center">{icon}</Emoji>
        <div className="w-full text-left gap-4 flex flex-col">
          <H1>{title}</H1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageCenter;
