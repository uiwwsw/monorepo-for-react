import { useToasts, ToastProps } from '@library-frontend/ui';
import { useState } from 'react';
import useSound from './useSound';
/* ======   interface   ====== */
export type ToastForAlarmProps = ToastProps & { serialNo: number };
/* ======    global     ====== */
const useToastsForAlarm = () => {
  /* ======   variables   ====== */
  const { showToast: baseShowToast, hideToast, Toasts } = useToasts();
  const { play } = useSound();
  const [cacheMessage, setCacheMessage] = useState<ToastForAlarmProps[]>([]);
  // const [toastMessages, setToastMessages] = useState<(ToastProps & { id: string; close?: true })[]>([]);

  /* ======   function    ====== */
  const showToast = (toast: ToastForAlarmProps) => {
    if (cacheMessage.some((x) => x.serialNo === toast.serialNo)) return;
    play();
    setCacheMessage((prev) => [...prev, toast]);
    baseShowToast(toast);
  };
  /* ======   useEffect   ====== */
  return {
    showToast,
    hideToast,
    Toasts,
  };
};

export default useToastsForAlarm;
