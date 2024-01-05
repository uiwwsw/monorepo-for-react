import { createLogger } from '@package-frontend/utils';
import ModalBase, { ModalBaseProps } from './Base';
import Portal from '@/Portal';
import { useEffect, useState } from 'react';

/* ======   interface   ====== */
export interface ModalWithPortalProps<T extends string> extends ModalBaseProps<T> {}
/* ======    global     ====== */
const logger = createLogger('components/ModalWithPortal');
const ModalWithPortal = <T extends string>({
  onClose,
  open: defaultOpen,
  children,
  onClosed,
  ...props
}: ModalWithPortalProps<T>) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ======   function    ====== */
  const handleClose = async (e?: T) => {
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
    if (defaultOpen === undefined) return;
    if (defaultOpen) {
      setOpen(true);
      setVisible(true);
    } else {
      setOpen(false);
    }
    logger('useEffect');
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
