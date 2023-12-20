import Spinner from '$/Spinner';
import SmoothWrap from './Smooth/Wrap';
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface LoadingProps {
  show: boolean;
  className?: string;
}
/* ======    global     ====== */
// const logger = createLogger('components/Loading');
export const Loading = ({ show = false, className }: LoadingProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <SmoothWrap value={show}>
      <div
        className={`fixed z-50 top-0 left-0 w-full h-full bg-white bg-opacity-50 flex items-center${
          className ? ` ${className}` : ''
        }`}
      >
        <span className="m-auto">
          <Spinner />
        </span>
      </div>
    </SmoothWrap>
  );
};
export default Loading;
