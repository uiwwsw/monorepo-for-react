import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface T4Props {}
/* ======    global     ====== */
const logger = createLogger('pages/Control/T4');
const T4 = (_: T4Props) => {
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

export default T4;
