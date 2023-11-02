import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';

/* ======   interface   ====== */
export interface SkeletonProps {
  children?: ReactNode;
  col?: string;
  className?: string;
}

/* ======    global     ====== */

const logger = createLogger('components/Skeleton');

const Skeleton = ({ children, col = '100%', className }: SkeletonProps) => {
  /* ======   variables   ====== */
  const skeletonContainerClassName = `grid gap-1${className ? ` ${className}` : ''}
  [&>*]:bg-e0e0e0 
  [&>*]:animate-skeleton
  `;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');

  return (
    <div className={skeletonContainerClassName} style={{ gridTemplateColumns: col }}>
      {children}
    </div>
  );
};

export default Skeleton;
