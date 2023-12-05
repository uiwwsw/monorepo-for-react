import { createLogger } from '@package-frontend/utils';
import { ModalBaseProps, ModalResult } from './Base';
import { ReactNode, useState } from 'react';
import Button from '@/Button';
import ModalWithPortal from './WithPortal';

/* ======   interface   ====== */
export interface ModalWithBtnProps extends ModalBaseProps {
  button?: ReactNode;
}
/* ======    global     ====== */
const logger = createLogger('components/ModalWithBtn');
const ModalWithBtn = ({ button = <Button>팝업</Button>, onClose, ...props }: ModalWithBtnProps) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const handleClose = async (e?: ModalResult) => {
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
