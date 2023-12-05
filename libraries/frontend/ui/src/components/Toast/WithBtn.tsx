import { createLogger } from '#/logger';
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
  const handleEval = async () => {
    onClose && (await onClose());
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <div onClick={handleOpen}>{button}</div>
      <ToastWithPortal {...props} open={open} onClose={handleEval} />
    </>
  );
};

export default ToastWithBtn;
