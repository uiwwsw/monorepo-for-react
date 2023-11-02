import { createLogger } from '@package-frontend/utils';
import ToastBase, { ToastBaseProps } from './Base';
import Portal from '@/Portal';
import { useEffect, useState } from 'react';

/* ======   interface   ====== */
export interface ToastWithPortalProps extends ToastBaseProps {}
/* ======    global     ====== */
const logger = createLogger('components/ToastWithPortal');
const ToastWithPortal = ({ children, onClosed, ...props }: ToastWithPortalProps) => {
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
    <Portal root="toast">
      <ToastBase {...props} onClosed={handleClosed}>
        {children}
      </ToastBase>
    </Portal>
  ) : null;
};

export default ToastWithPortal;
