import { createLogger } from '@package-frontend/utils';
import { ToastBaseProps } from './Base';
import { ReactNode, useState } from 'react';
import Button from '@/Button';
import ToastWithPortal from './WithPortal';
import { Size } from '@/Size';

/* ======   interface   ====== */
export interface ToastWithBtnProps extends ToastBaseProps {
  button?: ReactNode;
}
/* ======    global     ====== */
const logger = createLogger('components/ToastWithBtn');
const ToastWithBtn = ({ button = <Button>토스트</Button>, onEval, ...props }: ToastWithBtnProps) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const handleEval = async () => {
    onEval && (await onEval());
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <div onClick={handleOpen}>{button}</div>
      <ToastWithPortal {...props} open={open} onEval={handleEval} />
    </>
  );
};

export default ToastWithBtn;
