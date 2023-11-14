import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface ServerSubProps {}
/* ======    global     ====== */
const logger = createLogger('pages/Control/ServerSub');
const ServerSub = (_: ServerSubProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end space-x-2">
      <Button>Logs</Button>
    </div>
  );
};

export default ServerSub;
