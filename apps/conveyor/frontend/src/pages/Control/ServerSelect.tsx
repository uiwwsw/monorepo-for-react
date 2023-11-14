import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface ServerSelectProps {}
/* ======    global     ====== */
const logger = createLogger('pages/Control/ServerSelect');
const ServerSelect = (_: ServerSelectProps) => {
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
    </div>
  );
};

export default ServerSelect;
