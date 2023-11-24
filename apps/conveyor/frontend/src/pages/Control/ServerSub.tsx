import { ServerInfo } from '!/control/domain';
import { Button, ModalWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import ModalContentLogsServer from './ModalContentLogsServer';
/* ======   interface   ====== */
export interface ServerSubProps {
  row?: Row<ServerInfo>;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/ServerSub');
const ServerSub = ({ row }: ServerSubProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end space-x-2">
      <ModalWithBtn
        button={
          <Button themeSize={'sm'} themeColor={'tertiary'}>
            Logs
          </Button>
        }
        hasButton={['CANCEL']}
        persist
      >
        <ModalContentLogsServer sid={row?.original.sid} />
      </ModalWithBtn>
    </div>
  );
};

export default ServerSub;
