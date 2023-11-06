// import { useSmooth } from '#/useSmooth';
import { ReactNode, Suspense } from 'react';
import { SWRConfig } from 'swr';
import ErrorBoundary, { ErrorBoundaryProps } from './ErrorBoundary';
import { Spinner } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface AsyncBoundaryProps extends ErrorBoundaryProps {
  loading?: ReactNode;
  error?: string;
}
/* ======    global     ====== */
// const logger = createLogger('components/Accordion');
const AsyncBoundary = ({
  children,
  loading = <iframe src="/loading" className="w-screen h-screen"></iframe>,
  error,
}: AsyncBoundaryProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <SWRConfig
      value={{
        suspense: true,
        // onError: (error, _) => {
        //   logger(error.status, error.statusText, '우하하');
        // },
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
