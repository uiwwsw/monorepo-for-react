import { Button, ModalWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { TCMInfo } from '!/control/domain';
import ModalContentFirmware from './ModalContentFirmware';
/* ======   interface   ====== */
export interface TcmSubProps {
  row?: Row<TCMInfo>;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSub');
const TcmSub = (_: TcmSubProps) => {
  /* ======   variables   ====== */

  /* ======   function    ====== */

  logger('render');
  /* ======   useEffect   ====== */
  return (
    <div className="flex justify-end space-x-2 items-center p-2">
      <ModalWithBtn
        button={
          <Button themeSize={'sm'} themeColor={'tertiary'}>
            Firmware
          </Button>
        }
        hasButton={['CANCEL']}
      >
        {/* <ModalContentFirmware tid={row?.original.tid} /> */}
        <ModalContentFirmware />
      </ModalWithBtn>
      {/* <div>{row?.original.tid}</div> */}

      <Button themeSize={'sm'}>Process Kill</Button>
      <Button themeSize={'sm'}>Detail</Button>
      <Button themeSize={'sm'}>Logs</Button>
    </div>
  );
};

export default TcmSub;
