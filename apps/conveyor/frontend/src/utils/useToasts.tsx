import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';
import { ToastWithPortal } from '@library-frontend/ui';
/* ======   interface   ====== */
export interface UseToastProps<T> {
  selectedRows: T[];
}
export interface ToastProps {
  message: string;
  duration?: number;
}
export interface UseToastError<T> {
  id: T;
  message?: string;
}
/* ======    global     ====== */
const logger = createLogger('utils/useToasts');
const useToasts = <T,>(props?: UseToastProps<T>) => {
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
  const adapterEvent = async ({
    startMsg,
    failMsg,
    successMsg,
    event,
  }: {
    startMsg: string;
    failMsg: (errors: UseToastError<T>[]) => string;
    successMsg: string;
    event: (id: T) => void | Promise<unknown>;
  }) => {
    if (!props?.selectedRows) return showToast({ message: '선택되지 않았습니다.' });
    logger(props?.selectedRows + '이벤트 시작');
    showToast({ message: startMsg });

    const fails: { id: T; message?: string }[] = [];

    for (const id of props.selectedRows) {
      try {
        await event(id);
      } catch (e) {
        const { message } = e as Error;
        fails.push({
          id,
          message,
        });
      }
    }

    if (fails.length > 0) {
      showToast({
        message: failMsg(fails),
        duration: Infinity,
      });
    } else {
      showToast({
        message: successMsg,
        duration: Infinity,
      });
    }
    logger('이벤트 종료' + props?.selectedRows + '!!!' + fails.map((x) => x.id + (x?.message ?? '')).join());
  };
  /* ======   useEffect   ====== */
  return {
    showToast,
    adapterEvent,
    Toasts: toastMessages.map((x) => (
      <ToastWithPortal open key={x.id} duration={x.duration} onClosed={() => deleteToast(x.id)}>
        {x.message}
      </ToastWithPortal>
    )),
  };
};

export default useToasts;
