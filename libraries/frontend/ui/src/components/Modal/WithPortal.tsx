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
  const handleClose = async (e?: ModalResult) => {
    if (!e) onClose && onClose(e);
    else onClose && (await onClose(e));
    setOpen(false);
    logger('handleClose');
  };
  const handleClosed = () => {
    onClosed && onClosed();
    setVisible(false);
    logger('handleClosed');
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!defaultOpen) return;
    logger('useEffect');

    setOpen(true);
    setVisible(true);
  }, [defaultOpen]);

  return visible ? (
    <Portal root="modal">
      <ModalBase {...props} open={open} onClose={handleClose} onClosed={handleClosed}>
        {children}
      </ModalBase>
    </Portal>
  ) : null;
};

export default ModalWithPortal;
