import { useToasts } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface UseToastProps<T> {
  selectedRows: T[];
}
export interface UseToastError<T> {
  id: T;
  message?: string;
}
/* ======    global     ====== */
const logger = createLogger('utils/useToastsForControl');
const useToastsForControl = <T>({ selectedRows }: UseToastProps<T>) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { showToast, hideToast, Toasts } = useToasts();
  /* ======   function    ====== */
  const adapterEvent = async ({
    startMsg,
    failMsg,
    successMsg,
    duration = 3000,
    event,
  }: {
    startMsg: string;
    failMsg?: (errors: UseToastError<T>[]) => string;
    successMsg?: string;
    duration?: number;
    event: (id: T) => void | Promise<unknown>;
  }) => {
    if (!selectedRows) return showToast({ message: t('선택되지 않았습니다.') });
    const onlyStartMsg = !failMsg || !successMsg;
    logger(selectedRows + '이벤트 시작');
    if (onlyStartMsg) showToast({ message: startMsg, duration });
    else
      showToast({
        message: startMsg,
        duration,
        hasClose: false,
        notClose: true,
        hasGauge: true,
      });

    const fails: { id: T; message?: string }[] = [];

    for (const id of selectedRows) {
      try {
        await event(id);
      } catch (e) {
        if (onlyStartMsg) return;
        const { message } = e as Error;
        fails.push({
          id,
          message,
        });
      }
    }
    if (onlyStartMsg) return;

    hideToast(startMsg);
    if (fails.length > 0) {
      showToast({
        message: failMsg(fails),
        type: 'fail',
      });
    } else {
      showToast({
        type: 'success',
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
