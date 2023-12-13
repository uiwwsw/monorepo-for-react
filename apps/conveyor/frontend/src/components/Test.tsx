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
  const frontText = '정';
  const rotationText = `${frontText}상작동 하지 않아요. 추가 개발이 필요합니다.`;
  const duration = 1000 * (Math.floor(Math.random() * 9) + 5);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <span
        className={`flex rounded-sm overflow-hidden pointer-events-none absolute z-[2] text-white bg-red-600 px-1 text-xs bg-opacity-70${
          className ? ` ${className}` : ''
        }`}
      >
        <i className="opacity-0">{frontText}</i>
        <i
          className="whitespace-nowrap animate-led absolute before:content-[attr(data-text)] after:content-[attr(data-text)] after:absolute"
          style={{
            animationDuration: `${duration}ms`,
          }}
          data-text={rotationText}
        />
      </span>
      {children}
    </>
  );
};

export default Test;
