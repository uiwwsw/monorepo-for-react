// import { createLogger } from '@package-frontend/utils';
import { HTMLAttributes, ReactNode, useMemo, useRef } from 'react';
import Smooth from '.';
/* ======   interface   ====== */
export interface SmoothWrapProps extends HTMLAttributes<HTMLDivElement> {
  value?: boolean;
  delay?: number;
  children?: ReactNode;
  className?: string;
  onFinished?: (value: boolean) => unknown;
}

/* ======    global     ====== */
// const logger = createLogger('components/Smooth');
const SmoothWrap = ({ onFinished, value, children, className, delay = 500, style, ...props }: SmoothWrapProps) => {
  /* ======   variables   ====== */
  const elRef = useRef<HTMLDivElement>(null);
  const smoothClassName = useMemo(
    () =>
      `[&:not([data-smooth])]:hidden [&[data-smooth="HIDE"]]:hidden [&[data-smooth="SHOWING"]]:animate-show [&[data-smooth="HIDING"]]:pointer-events-none [&[data-smooth="HIDING"]]:animate-hide${
        className ? ` ${className}` : ''
      }`,
    [className],
  );
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <div
        {...props}
        className={smoothClassName}
        ref={elRef}
        style={{
          ...style,
          animationDuration: `${delay}ms`,
        }}
      >
        {children}
      </div>
      <Smooth value={value} delay={delay} itemRef={elRef} onFinished={onFinished} />
    </>
  );
};

export default SmoothWrap;
