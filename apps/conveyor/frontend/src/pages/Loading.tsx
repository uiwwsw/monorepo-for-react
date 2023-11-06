import { Spinner } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Loading');
const Loading = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center bg-white !bg-opacity-30">
      <span className="m-auto scale-[4]">
        <Spinner />
      </span>
    </div>
  );
};

export default Loading;
