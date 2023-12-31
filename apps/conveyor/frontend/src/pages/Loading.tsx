import { Spinner } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('pages/Loading');
const Loading = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="z-50 absolute top-0 left-0 w-full h-full flex items-center bg-white !bg-opacity-30">
      <span className="m-auto">
        <Spinner />
      </span>
    </div>
  );
};

export default Loading;
