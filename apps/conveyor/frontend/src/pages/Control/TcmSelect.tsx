import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface TcmSelectProps {}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSelect');
const TcmSelect = (_: TcmSelectProps) => {
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
      <Button>Update</Button>
    </div>
  );
};

export default TcmSelect;
