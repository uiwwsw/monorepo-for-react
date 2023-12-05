import { createLogger } from '@package-frontend/utils';
import { ToastBaseProps } from './Base';
import { ReactNode, useState } from 'react';
import Button from '@/Button';
import ToastWithPortal from './WithPortal';

/* ======   interface   ====== */
export interface ToastWithBtnProps extends ToastBaseProps {
  button?: ReactNode;
}
/* ======    global     ====== */
const logger = createLogger('components/ToastWithBtn');
const ToastWithBtn = ({ button = <Button>토스트</Button>, onClose, ...props }: ToastWithBtnProps) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const handleClose = async () => {
    onClose && (await onClose());
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
      <ToastWithPortal {...props} open={open} onClose={handleClose} />
    </>
  );
};

export default ToastWithBtn;
