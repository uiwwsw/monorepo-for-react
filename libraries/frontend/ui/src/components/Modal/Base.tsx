import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useAnimate from '#/useAnimate';
import ModalOverlay from './Overlay';
import ModalClose from './Close';
import ModalFooter from './Footer';
import { createLogger, getScrollbarWidth } from '@package-frontend/utils';
import { ButtonProps } from '@/Button';
import Loading from '@/Loading';
import ToastWithPortal from '@/Toast/WithPortal';
import Smooth from '@/Smooth';

/* ======   interface   ====== */
export interface ModalError {
  msg: string;
  open: boolean;
}
export type ModalErrors = Record<string, ModalError>;
export interface ModalBaseProps<T extends string> {
  hasToast?: boolean;
  children?: ReactNode;
  className?: string;
  persist?: boolean;
  hasCloseBtn?: boolean;
  defaultLoading?: boolean;
  open?: boolean;
  errorToastMsg?: (value: T) => string;
  hasButton?: T[];
  onClose?: (value?: T) => Promise<unknown> | unknown;
  onClosed?: () => void;
  smoothLoading?: ButtonProps['smoothLoading'];
}
/* ======    global     ====== */
const logger = createLogger('components/ModalBase');
const ModalBase = <T extends string>({
  errorToastMsg = (value) => `${value} 버튼 클릭 이벤트에 오류가 발생했습니다.`,
  open,
  persist = false,
  onClose,
  children,
  className,
  hasToast = true,
  defaultLoading = false,
  onClosed,
  hasCloseBtn,
  hasButton,
  smoothLoading = true,
}: ModalBaseProps<T>) => {
  /* ======   variables   ====== */
  const elRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<ModalErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { animate, setAnimate } = useAnimate();
  const hasFooter = useMemo(() => (hasButton ? hasButton.length > 0 : false), [hasButton]);
  const memoErrors: [string, ModalError][] = useMemo(() => {
    const arr = Object.entries(errors);
    if (open) return arr;
    return arr.map(([key, value]) => [key, { ...value, open: false }]);
  }, [errors, open]);
  /* ======   function    ====== */
  const init = (open: boolean) => {
    const scrollbarWidth = getScrollbarWidth();
    const { body } = document;
    body.style.paddingRight = open ? scrollbarWidth + 'px' : '';
    body.style.overflow = open ? 'hidden' : '';
  };
  const adapterClose: () => void = useCallback(
    () => (persist ? !(elRef.current?.dataset.smooth === 'SHOWING') && setAnimate(true) : onClose && onClose()),
    [setAnimate, hasToast, persist, onClose, setErrors],
  );
  const handleClosed = (value: boolean) => {
    if (value) return;
    onClosed && onClosed();
    logger('handleClosed');
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    open && setTimeout(() => elRef.current?.focus(), 0);
    init(!!open);
    logger('useEffect');

    return () => {
      init(false);
    };
  }, [open]);
  return (
    <>
      <Smooth value={open} delay={500} itemRef={elRef} onFinished={handleClosed} />
      <div
        className={`relative flex [&:not([data-smooth])]:hidden [&[data-smooth="HIDE"]]:hidden [&[data-smooth="HIDING"]]:pointer-events-none${
          className ? ` ${className}` : ''
        }`}
        role="dialog"
        ref={elRef}
        tabIndex={0}
        autoFocus
      >
        <ModalOverlay onClose={adapterClose} />
        <div
          className={`flex flex-col shadow-2xl relative bg-white m-auto self-center border border-slate-700 rounded-md p-4 min-w-[10rem] min-h-[10rem] [[data-smooth="SHOWING"]>&]:animate-modal-open [[data-smooth="HIDING"]>&]:animate-modal-close${
            animate ? ' animate-shake' : ''
          }`}
        >
          <Loading show={defaultLoading} className="absolute" />
          {hasCloseBtn && <ModalClose onClose={onClose} disabled={loading} />}
          <div className="max-h-[80vh] overflow-auto">{children}</div>
          {hasFooter && (
            <ModalFooter
              errorToastMsg={errorToastMsg}
              hasButton={hasButton}
              hasToast={hasToast}
              smoothLoading={smoothLoading}
              disabled={loading || !open}
              onLoading={setLoading}
              setErrors={setErrors}
              onClose={onClose}
            />
          )}
        </div>
      </div>
      {memoErrors.map(([key, { msg, open }]) => (
        <ToastWithPortal
          onClose={() =>
            setErrors((prev) => ({
              ...prev,
              [key]: {
                msg,
                open: false,
              },
            }))
          }
          onClosed={() =>
            setErrors((prev) =>
              Object.entries(prev).reduce(
                (a, v) => ({
                  ...a,
                  ...(v[1].open
                    ? {
                        [v[0]]: v[1],
                      }
                    : {}),
                }),
                {},
              ),
            )
          }
          key={key}
          duration={Infinity}
          open={open}
        >
          {msg}
        </ToastWithPortal>
      ))}
    </>
  );
};

export default ModalBase;
