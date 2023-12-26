import Close from '$/Close';
import Button from '@/Button';
import { ModalBaseProps } from './Base';

/* ======   interface   ====== */
export interface ModalCloseProps<T extends string> {
  disabled: boolean;
  onClose: ModalBaseProps<T>['onClose'];
}
/* ======    global     ====== */
const ModalClose = <T extends string>({ onClose, disabled }: ModalCloseProps<T>) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <Button
      themeSize={null}
      themeColor={null}
      aria-label="modal close button"
      onClick={() => onClose && onClose()}
      disabled={disabled}
      className={`!absolute right-0 top-0 !-m-3 w-auto !p-0`}
      style={{ zIndex: 51 }}
    >
      <Close />
    </Button>
  );
};

export default ModalClose;
