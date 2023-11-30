import { ServerInfo } from '!/control/domain';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import ModalLogsServer from './Modals/LogsServer';
/* ======   interface   ====== */
export interface ServerSubProps {
  row?: Row<ServerInfo>;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/ServerSub');
const ServerSub = ({ row }: ServerSubProps) => {
  /* ======   variables   ====== */
  const sid = row?.original.sid;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end gap-2 p-2">
      <ModalLogsServer sid={sid} />
    </div>
  );
};

export default ServerSub;
