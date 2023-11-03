import Button from '@/Button';
import { useSmooth } from '#/useSmooth';
import Close from '$/Close';
import { createLogger } from '@package-frontend/utils';
import { ReactNode, useEffect, useRef } from 'react';
/* ======   interface   ====== */
export interface ToastBaseProps {
  open?: boolean;
  children?: ReactNode;
  notClosed?: boolean;
  duration?: number;
  className?: string;
  onClose?: () => void;
  onClosed?: () => void;
}
/* ======    global     ====== */
const logger = createLogger('components/ToastBase');
const ToastBase = ({ notClosed, onClosed, open, children, onClose, duration = 5000, className }: ToastBaseProps) => {
  /* ======   variables   ====== */
  const isInfinity = notClosed ?? duration === Infinity;
  const elRef = useRef<HTMLDivElement>(null);

  const toastClassName = `relative flex border border-gray-400 px-5 py-2 rounded-sm bg-white [&:not([data-smooth])]:hidden [&[data-smooth="HIDE"]]:hidden [&[data-smooth="SHOWING"]]:animate-toastOpen [&[data-smooth="HIDING"]]:animate-toastClose${
    className ? ` ${className}` : ''
  }`;
  const toastLayerClassName = `absolute left-0 bottom-0 h-1 bg-black origin-left${
    open && !isInfinity ? ' w-full animate-countDown' : ''
  }${isInfinity ? ' w-full' : ''}`;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useSmooth({ value: open, delay: 500, ref: elRef, onClosed });
  useEffect(() => {
    if (!open || isInfinity) return;
    const timer = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(timer);
  }, [open]);
  // useEffect(() => {
  //   if (!_open) setOpen(false)
  // }, [_open])
  logger('render');
  return (
    <div className={toastClassName} role="alert" ref={elRef}>
      <i className={toastLayerClassName} style={{ animationDuration: duration + 'ms' }} />
      <span className="flex-1">{children}</span>
      {isInfinity ? (
        <Button onClick={onClose} className="-mr-4 ml-1" themeColor={null} themeSize={null}>
          <Close />
        </Button>
      ) : null}
    </div>
  );
};

export default ToastBase;
