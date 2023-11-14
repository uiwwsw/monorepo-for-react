import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface T1Props {}
/* ======    global     ====== */
const logger = createLogger('pages/Control/T1');
const T1 = (_: T1Props) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end space-x-2">
      <Button>Logs</Button>
      <Button>Firmware</Button>
    </div>
  );
};

export default T1;
