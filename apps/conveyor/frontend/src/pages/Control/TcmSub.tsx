import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface TcmSubProps {}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSub');
const TcmSub = (_: TcmSubProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end space-x-2">
      <Button>Update</Button>
      <Button>Process Kill</Button>
      <Button>Logs</Button>
    </div>
  );
};

export default TcmSub;
