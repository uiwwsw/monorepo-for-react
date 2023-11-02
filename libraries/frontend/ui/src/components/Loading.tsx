import Smooth from '@/Smooth';
import Spinner from '$/Spinner';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface LoadingProps {
  show: boolean;
}
/* ======    global     ====== */
const logger = createLogger('components/Loading');
export const Loading = ({ show = false }: LoadingProps) => {
  /* ======   variables   ====== */
  const loadingClassName = `fixed z-50 top-0 left-0 w-full h-full bg-white bg-opacity-50 flex items-center`;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <Smooth value={show}>
      <div className={loadingClassName}>
        <span className="m-auto">
          <Spinner />
        </span>
      </div>
    </Smooth>
  );
};
export default Loading;
