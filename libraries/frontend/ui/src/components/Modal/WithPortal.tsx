import { createLogger } from '@package-frontend/utils';
import ModalBase, { ModalBaseProps } from './Base';
import Portal from '@/Portal';
import { useEffect, useState } from 'react';

/* ======   interface   ====== */
export interface ModalWithPortalProps extends ModalBaseProps {}
/* ======    global     ====== */
const logger = createLogger('components/ModalWithPortal');
const ModalWithPortal = ({ children, onClosed, ...props }: ModalWithPortalProps) => {
  /* ======   variables   ====== */
  const [visible, setVisible] = useState(false);

  /* ======   function    ====== */
  const handleClosed = () => {
    onClosed && onClosed();
    setVisible(false);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    props.open && setVisible(true);
  }, [props.open]);

  logger('render');
  return visible ? (
    <Portal root="modal">
      <ModalBase {...props} onClosed={handleClosed}>
        {children}
      </ModalBase>
    </Portal>
  ) : null;
};

export default ModalWithPortal;
