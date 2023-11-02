import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { WithEval } from '#/componentTypes';
import { useSmooth } from '#/useSmooth';
import { useAnimate } from '#/useAnimate';
import ModalOverlay from './Overlay';
import ModalClose from './Close';
import ModalFooter from './Footer';
import { createLogger } from '@package-frontend/utils';
import { ButtonProps } from '@/Button';
import ToastWithPortal from '@/Toast/WithPortal';

/* ======   interface   ====== */
export interface ModalError {
  msg: string;
  open: boolean;
}
export type ModalErrors = Record<string, ModalError>;
export type ModalResult = 'OK' | 'CANCEL' | 'NONE';
export interface ModalBaseProps extends WithEval<ModalResult> {
  hasToast?: boolean;
  children?: ReactNode;
  className?: string;
  persist?: boolean;
  hideClose?: boolean;
  open?: boolean;
  onClosed?: () => void;
  smoothLoading?: ButtonProps['smoothLoading'];
}
/* ======    global     ====== */
const logger = createLogger('components/ModalBase');
const ModalBase = ({
  open,
  persist = false,
  hideClose = false,
  onEval,
  children,
  className,
  hasToast = true,
  onClosed,
  smoothLoading = true,
}: ModalBaseProps) => {
  /* ======   variables   ====== */
  const elRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<ModalErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { animate, setAnimate } = useAnimate();
  const memoErrors: [string, ModalError][] = useMemo(() => {
    const arr = Object.entries(errors);
    if (open) return arr;
    return arr.map(([key, value]) => [key, { ...value, open: false }]);
  }, [errors, open]);
  const modalClassName = `relative flex [&:not([data-smooth])]:hidden [&[data-smooth="HIDE"]]:hidden [&[data-smooth="HIDING"]]:pointer-events-none${
    className ? ` ${className}` : ''
  }`;
  const modalContentClassName = `flex flex-col relative bg-white m-auto self-center border border-slate-700 rounded-md p-4 min-w-[10rem] min-h-[10rem] [[data-smooth="SHOWING"]>&]:animate-modalOpen [[data-smooth="HIDING"]>&]:animate-modalClose${
    animate ? ' animate-shake' : ''
  }`;
  /* ======   function    ====== */
  const adapterClose: () => void = useCallback(
    () =>
      persist
        ? !(elRef.current?.dataset.smooth === 'SHOWING') && setAnimate(true)
        : (async () => {
            logger(hasToast);
            try {
              onEval && (await onEval('NONE'));
            } catch {
              hasToast &&
                setErrors((prev) => ({
                  ...prev,
                  [new Date().valueOf()]: {
                    msg: '팝업을 닫는 중 오류가 발생했어요.',
                    open: true,
                  },
                }));
            }
          })(),
    [setAnimate, hasToast, persist, onEval, setErrors],
  );
  /* ======   useEffect   ====== */
  useSmooth({
    value: open,
    delay: 500,
    ref: elRef,
    onClosed,
  });
  logger('render');
  return (
    <>
      <div className={modalClassName} role="dialog" ref={elRef}>
        <ModalOverlay onClose={adapterClose} />
        <div className={modalContentClassName}>
          {hideClose ? null : <ModalClose onClose={adapterClose} disabled={loading} />}
          <div>{children}</div>
          <ModalFooter
            hasToast={hasToast}
            smoothLoading={smoothLoading}
            disabled={loading || !open}
            onLoading={setLoading}
            setErrors={setErrors}
            onEval={onEval}
          />
        </div>
      </div>
      {memoErrors.map(([key, { msg, open }]) => (
        <ToastWithPortal
          onEval={() =>
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
