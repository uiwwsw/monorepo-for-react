import useSmooth from '#/useSmooth';
import { createLogger } from '@package-frontend/utils';
import { HTMLAttributes, ReactNode, useMemo, useRef } from 'react';
/* ======   interface   ====== */
export interface SmoothProps extends HTMLAttributes<HTMLDivElement> {
  value?: boolean;
  delay?: number;
  children?: ReactNode;
  className?: string;
  onFinished?: (value: boolean) => unknown;
}

/* ======    global     ====== */
const logger = createLogger('components/Smooth');
const Smooth = ({ onFinished, value, children, className, delay = 500, style, ...props }: SmoothProps) => {
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
  useSmooth({ value, delay, ref: elRef, onFinished });
  logger('render');
  return (
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
  );
};

export default Smooth;
