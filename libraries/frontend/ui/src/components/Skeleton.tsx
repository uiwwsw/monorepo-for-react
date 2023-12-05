// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';

/* ======   interface   ====== */
export interface SkeletonProps {
  children?: ReactNode;
  col?: string;
  className?: string;
}

/* ======    global     ====== */

// const logger = createLogger('components/Skeleton');

const Skeleton = ({ children, col = '100%', className }: SkeletonProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // logger(col, children,className);
  return (
    <div
      className={`grid [&>*]:bg-e0e0e0 [&>*]:animate-skeleton gap-1${className ? ` ${className}` : ''}`}
      style={{ gridTemplateColumns: col }}
    >
      {children}
    </div>
  );
};

export default Skeleton;
