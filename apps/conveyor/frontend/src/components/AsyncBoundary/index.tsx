// import { useSmooth } from '#/useSmooth';
import { ReactNode, Suspense } from 'react';
import { SWRConfig } from 'swr';
import ErrorBoundary, { ErrorBoundaryProps } from './ErrorBoundary';
import { createLogger } from '#/logger';
/* ======   interface   ====== */
export interface AsyncBoundaryProps extends ErrorBoundaryProps {
  loading?: ReactNode;
  error?: string;
}

/* ======    global     ====== */
const logger = createLogger('components/AsyncBoundary');
const AsyncBoundary = ({
  children,
  loading = <iframe src="/loading" className="w-screen h-screen" />,
  error,
}: AsyncBoundaryProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <SWRConfig
      value={{
        suspense: true,
      }}
    >
      <Suspense fallback={loading}>
        <ErrorBoundary error={error}>{children}</ErrorBoundary>
        {/* <Smooth>{children}</Smooth> */}
      </Suspense>
    </SWRConfig>
  );
};

export default AsyncBoundary;
