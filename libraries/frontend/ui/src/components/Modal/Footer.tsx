import { MouseEvent, SetStateAction, useCallback } from 'react';
import Button, { ButtonProps } from '@/Button';
import { ModalBaseProps, ModalErrors, ModalResult } from './Base';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface ModalFooterProps {
  open?: boolean;
  hasToast?: boolean;
  onLoading: (value: SetStateAction<boolean>) => void;
  setErrors: (value: SetStateAction<ModalErrors>) => void;
  disabled: boolean;
  onClose: ModalBaseProps['onClose'];
  smoothLoading: ButtonProps['smoothLoading'];
}
/* ======    global     ====== */
const logger = createLogger('component/ModalFooter');
const ModalFooter = ({ hasToast, setErrors, onClose, onLoading, disabled, smoothLoading }: ModalFooterProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  logger('hasToast', hasToast);
  const adapterClick = useCallback(
    async (e: MouseEvent) => {
      logger('click');
      onLoading(true);
      const value = e.currentTarget.textContent;
      let res: ModalResult = 'OK';
      switch (value) {
        case 'ok':
          res;
          break;
        default:
          res = 'CANCEL';
          break;
      }
      try {
        onClose && (await onClose(res));
      } catch {
        hasToast &&
          setErrors((prev) => ({
            ...prev,
            [new Date().valueOf()]: {
              msg: `${res} 버튼 클릭 이벤트에 오류가 발생했습니다.`,
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
  return onClose ? (
    <div className="flex gap-3 mt-auto pt-3">
      <Button
        className="flex-auto"
        themeSize="sm"
        smoothLoading={smoothLoading}
        disabled={disabled}
        onClick={adapterClick}
      >
        ok
      </Button>
      <Button
        className="flex-auto"
        themeSize="sm"
        themeColor="secondary"
        smoothLoading={smoothLoading}
        disabled={disabled}
        onClick={adapterClick}
      >
        cancel
      </Button>
    </div>
  ) : null;
};

export default ModalFooter;
