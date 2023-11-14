import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface T2Props {}
/* ======    global     ====== */
const logger = createLogger('pages/Control/T2');
const T2 = (_: T2Props) => {
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

export default T2;
