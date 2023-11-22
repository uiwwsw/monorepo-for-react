import { Button, ModalWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import ModalContent from './ModalContent';
/* ======   interface   ====== */
export interface TcmSelectProps {
  selectedRows?: number[];
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSelect');
const TcmSelect = ({ selectedRows }: TcmSelectProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end space-x-2 items-center">
      <Button themeSize={'sm'}>Start</Button>
      <Button themeSize={'sm'}>Stop</Button>
      <Button themeSize={'sm'}>Restart</Button>
      <Button themeSize={'sm'}>Reload</Button>
    </div>
  );
};

export default TcmSelect;
