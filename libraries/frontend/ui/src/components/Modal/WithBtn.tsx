import { createLogger } from '#/logger';
import { ModalBaseProps, ModalResult } from './Base';
import { ReactNode, useState } from 'react';
import Button from '@/Button';
import ModalWithPortal from './WithPortal';

/* ======   interface   ====== */
export interface ModalWithBtnProps extends ModalBaseProps {
  button?: ReactNode;
}
/* ======    global     ====== */
const logger = createLogger('components/ModalWithBtn');
const ModalWithBtn = ({ button = <Button>팝업</Button>, onClose, ...props }: ModalWithBtnProps) => {
  /* ======   variables   ====== */
  const [open, setOpen] = useState(false);
  const handleEval = async (e?: ModalResult) => {
    onClose && (await onClose(e));
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <div onClick={handleOpen}>{button}</div>
      <ModalWithPortal {...props} open={open} onClose={handleEval} />
    </>
  );
};

export default ModalWithBtn;
