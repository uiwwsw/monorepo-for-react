import { createLogger } from '@package-frontend/utils';
import { ToastBaseProps } from './Base';
import { useState } from 'react';
import Button from '@/Button';
import ToastWithPortal from './WithPortal';
import { Theme } from '@/Color';
import { Size } from '@/Size';

/* ======   interface   ====== */
export interface ToastWithBtnProps extends ToastBaseProps {
  btnName?: string;
  btnTheme?: Theme;
  btnSize?: Size;
}
/* ======    global     ====== */
const logger = createLogger('components/ToastWithBtn');
const ToastWithBtn = ({
  btnName = '토스트',
  btnTheme = 'primary',
  btnSize = 'md',
  onEval,
  ...props
}: ToastWithBtnProps) => {
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
      <Button theme={btnTheme} size={btnSize} onClick={handleOpen}>
        {btnName}
      </Button>
      <ToastWithPortal {...props} open={open} onEval={handleEval} />
    </>
  );
};

export default ToastWithBtn;
