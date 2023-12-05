import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';
import ToastWithPortal, { ToastWithPortalProps } from '@/Toast/WithPortal';
import useThrottle from './useThrottle';
/* ======   interface   ====== */

export interface ToastProps extends ToastWithPortalProps {
  message: string;
}
/* ======    global     ====== */
const logger = createLogger('utils/useToasts');
const useToasts = () => {
  /* ======   variables   ====== */
  const [toastMessages, setToastMessages] = useState<(ToastProps & { id: string; close?: true })[]>([]);

  /* ======   function    ====== */
  const showToast = (toast: ToastProps) => {
    logger('showToast', toast);
    setToastMessages((prev) => [
      ...prev,
      {
        ...toast,
        id: new Date().valueOf().toString(),
      },
    ]);
  };
  const hideToast = (message: string) => {
    logger('hideToast', message);

    setToastMessages((prev) =>
      prev.map((x) => {
        if (x.message === message) return { ...x, close: true } as (typeof toastMessages)[number];
        return x;
      }),
    );
  };

  const deleteToast = (id: string) => {
    logger('deleteToast', id);

    setToastMessages((prev) => prev.filter((x) => x.id !== id));
  };

  /* ======   useEffect   ====== */
  return {
    showToast: useThrottle(showToast, 300),
    hideToast,
    Toasts: toastMessages.map((x) => (
      <ToastWithPortal {...x} open={!x.close} key={x.id} onClosed={() => deleteToast(x.id)}>
        {x.message}
      </ToastWithPortal>
    )),
  };
};

export default useToasts;
