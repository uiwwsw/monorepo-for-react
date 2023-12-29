// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface TestProps {
  children?: ReactNode;
  className?: string;
}

/* ======    global     ====== */
// const logger = createLogger('components/Test');
const text = '정상작동 하지 않아요. 추가 개발이 필요합니다.';
const frontLength = 1;
const Test = ({ children, className }: TestProps) => {
  /* ======   variables   ====== */
  const frontText = text.substring(0, frontLength);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <span
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={`flex rounded-sm overflow-hidden absolute z-[2] bg-red-600 px-1 text-xs transition-all hover:pr-10 hover:text-xl${
          className ? ` ${className}` : ''
        }`}
      >
        <i className="opacity-0">{frontText}</i>
        <i
          className="whitespace-nowrap animate-led absolute before:mr-[.3em] after:mr-[.3em] before:content-[attr(data-small)] after:content-[attr(data-small)] after:absolute hover:after:content-[attr(data-text)] hover:before:content-[attr(data-text)]"
          data-small="TEST"
          data-text={text}
        />
      </span>
      {children}
    </>
  );
};

export default Test;
