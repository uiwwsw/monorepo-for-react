import Close from '$/Close';
import Button from '@/Button';

/* ======   interface   ====== */
export interface ModalCloseProps {
  disabled: boolean;
  onClose: () => void;
}
/* ======    global     ====== */
const ModalClose = ({ onClose, disabled }: ModalCloseProps) => {
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
    >
      <Close />
    </Button>
  );
};

export default ModalClose;
