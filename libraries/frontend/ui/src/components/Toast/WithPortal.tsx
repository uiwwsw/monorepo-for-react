import { createLogger } from '@package-frontend/utils';
import ToastBase, { ToastBaseProps } from './Base';
import Portal from '@/Portal';
import { useEffect, useState } from 'react';

/* ======   interface   ====== */
export interface ToastWithPortalProps extends ToastBaseProps {}
/* ======    global     ====== */
const logger = createLogger('components/ToastWithPortal');
const ToastWithPortal = ({ onClose, open: defaultOpen, children, onClosed, ...props }: ToastWithPortalProps) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ======   function    ====== */
  const handleOpen = () => {
    setOpen(true);
    setVisible(true);
    logger('handleOpen');
  };
  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
    logger('handleClose');
  };
  const handleClosed = () => {
    onClosed && onClosed();
    setVisible(false);
    logger('handleClosed');
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!defaultOpen) return handleClose();
    logger('useEffect');

    handleOpen();
  }, [defaultOpen]);

  return visible ? (
    <Portal root="toast">
      <ToastBase {...props} open={open} onClose={handleClose} onClosed={handleClosed}>
        {children}
      </ToastBase>
    </Portal>
  ) : null;
};

export default ToastWithPortal;
