import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';
import ToastWithPortal from '@/Toast/WithPortal';
import useThrottle from './useThrottle';
/* ======   interface   ====== */

export interface ToastProps {
  message: string;
  duration?: number;
}
/* ======    global     ====== */
const logger = createLogger('utils/useToasts');
const useToasts = () => {
  /* ======   variables   ====== */
  const [toastMessages, setToastMessages] = useState<(ToastProps & { id: string })[]>([]);

  /* ======   function    ====== */
  const showToast = (toast: ToastProps) =>
    setToastMessages((prev) => [
      ...prev,
      {
        ...toast,
        id: new Date().valueOf().toString(),
      },
    ]);

  const deleteToast = (id: string) => setToastMessages((prev) => prev.filter((x) => x.id !== id));

  /* ======   useEffect   ====== */
  logger('render');
  return {
    showToast: useThrottle(showToast, 300),
    Toasts: toastMessages.map((x) => (
      <ToastWithPortal open key={x.id} duration={x.duration} onClosed={() => deleteToast(x.id)}>
        {x.message}
      </ToastWithPortal>
    )),
  };
};

export default useToasts;
