import { useToasts, ToastProps } from '@library-frontend/ui';
import { useState } from 'react';
/* ======   interface   ====== */
export type ToastForAlarmProps = ToastProps & { serialNo: number };
/* ======    global     ====== */
const useToastsForAlarm = () => {
  /* ======   variables   ====== */
  const { showToast, hideToast, Toasts } = useToasts(0);
  const [cacheMessage, setCacheMessage] = useState<ToastForAlarmProps[]>([]);
  // const [toastMessages, setToastMessages] = useState<(ToastProps & { id: string; close?: true })[]>([]);

  /* ======   function    ====== */
  const adapterShowToast = (toast: ToastForAlarmProps) => {
    if (cacheMessage.some((x) => x.serialNo === toast.serialNo)) return;
    setCacheMessage((prev) => [...prev, toast]);
    showToast(toast);
  };
  /* ======   useEffect   ====== */
  return {
    showToast: adapterShowToast,
    hideToast,
    Toasts,
  };
};

export default useToastsForAlarm;
