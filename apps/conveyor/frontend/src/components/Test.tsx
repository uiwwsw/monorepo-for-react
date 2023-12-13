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
  const frontText = '정상작동';
  const rotationText = `${frontText}하지 않아요. 추가 개발이 필요합니다.　`;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <span
        className={`flex rounded-sm overflow-hidden pointer-events-none absolute z-50 text-white bg-red-600 p-1 text-xs bg-opacity-70${
          className ? ` ${className}` : ''
        }`}
      >
        <i className="opacity-0">{frontText}</i>
        <i
          className="whitespace-nowrap animate-led absolute before:content-[attr(data-text)] after:content-[attr(data-text)] after:absolute"
          data-text={rotationText}
        />
      </span>
      {children}
    </>
  );
};

export default Test;
