import { createLogger } from '@package-frontend/utils';
import { ModalBaseProps } from './Base';
import { ReactNode, useState } from 'react';
import Button from '@/Button';
import ModalWithPortal from './WithPortal';

/* ======   interface   ====== */
export interface ModalWithBtnProps<T extends string> extends ModalBaseProps<T> {
  button?: ReactNode;
}
/* ======    global     ====== */
const logger = createLogger('components/ModalWithBtn');
const ModalWithBtn = <T extends string>({
  button = <Button>팝업</Button>,
  onClose,
  ...props
}: ModalWithBtnProps<T>) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const handleClose = async (e?: T) => {
    onClose && (await onClose(e));
    setOpen(false);
    logger('handleClose');
  };
  const handleOpen = () => {
    setOpen(true);
    logger('handleOpen');
  };
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <div onClick={handleOpen}>{button}</div>
      <ModalWithPortal {...props} open={open} onClose={handleClose} />
    </>
  );
};

export default ModalWithBtn;
