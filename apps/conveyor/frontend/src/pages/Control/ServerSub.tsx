// import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import ModalLogsServer from './Modals/LogsServer';
import { ServerList } from '!/control/domain';
/* ======   interface   ====== */
export interface ControlServerSubProps {
  row?: Row<ServerList>;
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/ControlServerSub');
const ControlServerSub = ({ row }: ControlServerSubProps) => {
  /* ======   variables   ====== */
  const stateType = row?.original.stateType;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex justify-end gap-2 p-2">
      <ModalLogsServer stateType={stateType} />
    </div>
  );
};

export default ControlServerSub;
