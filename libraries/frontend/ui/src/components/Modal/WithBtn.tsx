import { createLogger } from '@package-frontend/utils';
import { ModalBaseProps } from './Base';
import { useState } from 'react';
import Button from '@/Button';
import ModalWithPortal from './WithPortal';
import { Theme } from '@/Color';
import { Size } from '@/Size';

/* ======   interface   ====== */
export interface ModalWithBtnProps extends ModalBaseProps {
  btnName?: string;
  btnTheme?: Theme;
  btnSize?: Size;
}
/* ======    global     ====== */
const logger = createLogger('components/ModalWithBtn');
const ModalWithBtn = ({
  btnName = '팝업',
  btnTheme = 'primary',
  btnSize = 'md',
  onEval,
  ...props
}: ModalWithBtnProps) => {
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
      <ModalWithPortal {...props} open={open} onEval={handleEval} />
    </>
  );
};

export default ModalWithBtn;
