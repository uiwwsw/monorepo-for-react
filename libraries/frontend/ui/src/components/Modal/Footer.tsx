import { MouseEvent, SetStateAction, useCallback } from 'react';
import Button, { ButtonProps } from '@/Button';
import { ModalBaseProps, ModalErrors } from './Base';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface ModalFooterProps<T extends string> {
  open?: boolean;
  hasToast?: boolean;
  errorToastMsg: (value: T) => string;
  onLoading: (value: SetStateAction<boolean>) => void;
  setErrors: (value: SetStateAction<ModalErrors>) => void;
  disabled: boolean;
  onClose: ModalBaseProps<T>['onClose'];
  smoothLoading: ButtonProps['smoothLoading'];
  hasButton: ModalBaseProps<T>['hasButton'];
}
/* ======    global     ====== */
const logger = createLogger('component/ModalFooter');
const ModalFooter = <T extends string>({
  errorToastMsg,
  hasButton,
  hasToast,
  setErrors,
  onClose,
  onLoading,
  disabled,
  smoothLoading,
}: ModalFooterProps<T>) => {
  /* ======   variables   ====== */
  // const hasOkBtn = useMemo(() => hasButton?.includes('OK'), [hasButton]);
  // const hasCancelBtn = useMemo(() => hasButton?.includes('CANCEL'), [hasButton]);
  /* ======   function    ====== */
  // logger('hasToast', hasToast);
  const adapterClick = useCallback(
    async (e: MouseEvent) => {
      logger('click');
      onLoading(true);
      const value = e.currentTarget.textContent as T;
      try {
        onClose && (await onClose(value));
      } catch {
        hasToast &&
          setErrors((prev) => ({
            ...prev,
            [new Date().valueOf()]: {
              msg: errorToastMsg(value),
              open: true,
            },
          }));
      }
      onLoading(false);
      logger('adapterClick');
    },
    [onLoading, onClose, hasToast, setErrors],
  );
  /* ======   useEffect   ====== */
  return (
    <div className="flex gap-3 mt-auto pt-3">
      {hasButton?.map((x, i) => (
        <Button
          key={x}
          className="flex-auto"
          themeSize="sm"
          themeColor={i === 0 ? 'primary' : 'secondary'}
          smoothLoading={smoothLoading}
          disabled={disabled}
          onClick={adapterClick}
        >
          {x}
        </Button>
      ))}
    </div>
  );
};

export default ModalFooter;
