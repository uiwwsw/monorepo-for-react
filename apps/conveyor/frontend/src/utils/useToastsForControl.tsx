import { useToasts, ToastProps } from '@library-frontend/ui';
import { createLogger } from '#/logger';
/* ======   interface   ====== */
export interface UseToastProps<T> {
  selectedRows: T[];
  duration?: ToastProps['duration'];
}
export interface UseToastError<T> {
  id: T;
  message?: string;
}
/* ======    global     ====== */
const logger = createLogger('utils/useToastsForControl');
const useToastsForControl = <T,>({ selectedRows, duration = 3000 }: UseToastProps<T>) => {
  /* ======   variables   ====== */
  const { showToast, hideToast, Toasts } = useToasts();
  /* ======   function    ====== */
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
    if (!selectedRows) return showToast({ message: '선택되지 않았습니다.' });
    logger(selectedRows + '이벤트 시작');
    showToast({
      message: startMsg,
      duration: duration * selectedRows.length,
      hasClose: false,
      notClose: true,
      hasGauge: true,
    });

    const fails: { id: T; message?: string }[] = [];

    for (const id of selectedRows) {
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

    hideToast(startMsg);
    if (fails.length > 0) {
      showToast({
        message: failMsg(fails),
      });
    } else {
      showToast({
        message: successMsg,
      });
    }
    logger('이벤트 종료' + selectedRows + '!!!' + fails.map((x) => x.id + (x?.message ?? '')).join());
  };
  /* ======   useEffect   ====== */
  return {
    showToast,
    adapterEvent,
    Toasts,
  };
};

export default useToastsForControl;
