import { MouseEvent, SetStateAction, useCallback } from 'react';
import Button, { ButtonProps } from '@/Button';
import { ModalBaseProps, ModalErrors, ModalResult } from './Base';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface ModalFooterProps {
  open?: boolean;
  hasToast?: boolean;
  errorToastMsg: (value: ModalResult) => string;
  onLoading: (value: SetStateAction<boolean>) => void;
  setErrors: (value: SetStateAction<ModalErrors>) => void;
  disabled: boolean;
  onClose: ModalBaseProps['onClose'];
  smoothLoading: ButtonProps['smoothLoading'];
  hasButton: Exclude<ModalBaseProps['hasButton'], 'NONE'>;
}
/* ======    global     ====== */
const logger = createLogger('component/ModalFooter');
const ModalFooter = ({
  errorToastMsg,
  hasButton,
  hasToast,
  setErrors,
  onClose,
  onLoading,
  disabled,
  smoothLoading,
}: ModalFooterProps) => {
  /* ======   variables   ====== */
  // const hasOkBtn = useMemo(() => hasButton?.includes('OK'), [hasButton]);
  // const hasCancelBtn = useMemo(() => hasButton?.includes('CANCEL'), [hasButton]);
  /* ======   function    ====== */
  // logger('hasToast', hasToast);
  const adapterClick = useCallback(
    async (e: MouseEvent) => {
      logger('click');
      onLoading(true);
      const value = e.currentTarget.textContent as ModalResult;
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
    },
    [onLoading, onClose, hasToast, setErrors],
  );
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex gap-3 mt-auto pt-3">
      {hasButton?.map((x, i) => (
        <Button
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
