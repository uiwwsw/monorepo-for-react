import { useToasts } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
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
const logger = createLogger('utils/useToastsForControl');
const useToastsForControl = <T,>(props?: UseToastProps<T>) => {
  /* ======   variables   ====== */
  const { showToast, Toasts } = useToasts();
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
    Toasts,
  };
};

export default useToastsForControl;
