import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
export interface ComponentNameProps {}
/* ======    global     ====== */
const logger = createLogger('components/Test');
const ComponentName = (props: ComponentNameProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <div {...props}>ComponentName Component</div>;
};

export default ComponentName;
