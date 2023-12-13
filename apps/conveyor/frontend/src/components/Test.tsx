// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface TestProps {
  children?: ReactNode;
  className?: string;
}

/* ======    global     ====== */
// const logger = createLogger('components/Test');
const Test = ({ children, className }: TestProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <span
        className={`flex overflow-hidden pointer-events-none absolute z-50 text-white bg-red-600 p-1 text-xs opacity-30${
          className ? ` ${className}` : ''
        }`}
      >
        <i className="opacity-0">TEST</i>
        <i
          className="whitespace-nowrap animate-led absolute after:content-[attr(data-text)] after:absolute"
          data-text="TEST"
        >
          TEST 작업이 완료되지 않았습니다.
        </i>
      </span>
      {children}
    </>
  );
};

export default Test;
