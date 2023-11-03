import { createLogger } from '@package-frontend/utils';
import ModalBase, { ModalBaseProps, ModalResult } from './Base';
import Portal from '@/Portal';
import { useEffect, useState } from 'react';

/* ======   interface   ====== */
export interface ModalWithPortalProps extends ModalBaseProps {}
/* ======    global     ====== */
const logger = createLogger('components/ModalWithPortal');
const ModalWithPortal = ({ onClose, open: defaultOpen, children, onClosed, ...props }: ModalWithPortalProps) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ======   function    ====== */
  const handleClose = (e?: ModalResult) => {
    setOpen(false);
    onClose && onClose(e);
  };
  const handleClosed = () => {
    onClosed && onClosed();
    setVisible(false);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!defaultOpen) return;

    setOpen(true);
    setVisible(true);
  }, [defaultOpen]);

  logger('render');
  return visible ? (
    <Portal root="modal">
      <ModalBase {...props} open={open} onClose={handleClose} onClosed={handleClosed}>
        {children}
      </ModalBase>
    </Portal>
  ) : null;
};

export default ModalWithPortal;
