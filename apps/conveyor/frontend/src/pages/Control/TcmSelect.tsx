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
    <div className="flex justify-end space-x-2">
      <Button>Start</Button>
      <Button>Stop</Button>
      <Button>Restart</Button>
      <Button>Reload</Button>
      <ModalWithBtn persist button={<Button>Update</Button>} hasButton={['CANCEL']}>
        <ModalContent selectedRows={selectedRows} />
      </ModalWithBtn>
    </div>
  );
};

export default TcmSelect;
