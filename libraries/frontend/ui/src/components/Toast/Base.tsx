import Button from '@/Button';
import useSmooth from '#/useSmooth';
import Close from '$/Close';
import { createLogger } from '@package-frontend/utils';
import { ReactNode, useEffect, useRef } from 'react';
/* ======   interface   ====== */
export interface ToastBaseProps {
  open?: boolean;
  children?: ReactNode;
  notClose?: boolean;
  duration?: number;
  hasClose?: boolean;
  hasGauge?: boolean;
  className?: string;
  onClose?: () => void;
  onClosed?: () => void;
}
/* ======    global     ====== */
const logger = createLogger('components/ToastBase');
const ToastBase = ({
  hasClose,
  hasGauge,
  notClose = false,
  onClosed,
  open,
  children,
  onClose,
  duration = 5000,
  className,
}: ToastBaseProps) => {
  /* ======   variables   ====== */
  if (hasClose === undefined) hasClose = !!notClose;
  if (hasGauge === undefined) hasGauge = !notClose;
  const isImportant = notClose && hasGauge;
  const elRef = useRef<HTMLDivElement>(null);
  const delay = (4 / 5) * duration;
  /* ======   function    ====== */
  const handleClosed = (value: boolean) => {
    if (value) return;
    onClosed && onClosed();
    logger('handleClosed');
  };
  /* ======   useEffect   ====== */
  useSmooth({ value: open, delay: 500, ref: elRef, onFinished: handleClosed });
  useEffect(() => {
    if (notClose) return;
    logger(`useEffect: open = ${open}`);
    if (!open) return onClose && onClose();
    const timer = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(timer);
  }, [open]);
  // useEffect(() => {
  //   if (!_open) setOpen(false)
  // }, [_open])
  return (
    <div
      className={`relative flex items-center border border-gray-400 px-5 py-2 rounded-sm bg-white overflow-hidden [&:not([data-smooth])]:hidden [&[data-smooth="HIDE"]]:hidden [&[data-smooth="SHOWING"]]:animate-toast-open [&[data-smooth="HIDING"]]:animate-toast-close${
        className ? ` ${className}` : ''
      }`}
      role="alert"
      ref={elRef}
    >
      <i
        className={`absolute bg-black flex left-0 bottom-0 h-1 origin-left${
          open && hasGauge ? ' w-full animate-count-down-bg' : ''
        }`}
        style={{
          animationDelay: delay + 'ms',
        }}
      >
        <i
          className={`flex-auto${hasGauge ? '' : ' flex-0'}${isImportant ? ' basis-1/2 animate-count-down-fake' : ''}`}
          style={{
            animationDelay: duration + 'ms',
          }}
        />
        <i
          className={`bg-white${open && hasGauge ? ' animate-count-down-x' : ''}`}
          style={{
            animationDuration: duration + 'ms',
          }}
        />
      </i>
      <span className="flex-1">{children}</span>
      {hasClose && (
        <Button onClick={onClose} className="-mr-4 ml-1" themeColor={null} themeSize={null}>
          <Close />
        </Button>
      )}
    </div>
  );
};

export default ToastBase;
