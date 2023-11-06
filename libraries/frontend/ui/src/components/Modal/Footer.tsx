import { MouseEvent, SetStateAction, useCallback, useMemo } from 'react';
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
  hasButton: Exclude<ModalBaseProps['hasButton'], 'NONE'>;
}
/* ======    global     ====== */
const logger = createLogger('component/ModalFooter');
const ModalFooter = ({
  hasButton,
  hasToast,
  setErrors,
  onClose,
  onLoading,
  disabled,
  smoothLoading,
}: ModalFooterProps) => {
  /* ======   variables   ====== */
  const hasOkBtn = useMemo(() => hasButton?.includes('OK'), [hasButton]);
  const hasCancelBtn = useMemo(() => hasButton?.includes('CANCEL'), [hasButton]);
  /* ======   function    ====== */
  logger('hasToast', hasToast);
  const adapterClick = useCallback(
    async (e: MouseEvent) => {
      logger('click');
      onLoading(true);
      const value = e.currentTarget.textContent;
      let res: ModalResult = 'OK';
      switch (value) {
        case '확인':
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
  return (
    <div className="flex gap-3 mt-auto pt-3">
      {hasOkBtn && (
        <Button
          className="flex-auto"
          themeSize="sm"
          smoothLoading={smoothLoading}
          disabled={disabled}
          onClick={adapterClick}
        >
          확인
        </Button>
      )}
      {hasCancelBtn && (
        <Button
          className="flex-auto"
          themeSize="sm"
          themeColor="secondary"
          smoothLoading={smoothLoading}
          disabled={disabled}
          onClick={adapterClick}
        >
          취소
        </Button>
      )}
    </div>
  );
};

export default ModalFooter;
