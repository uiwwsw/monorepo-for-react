// import { createLogger } from '@package-frontend/utils';
import { UPLOAD_STATUS } from '!/control/domain';

/* ======   interface   ====== */
export interface ProgressBarProps {
  value: number;
  status: UPLOAD_STATUS;
}

/* ======    global     ====== */
const statusClasses: Record<UPLOAD_STATUS, string> = {
  [UPLOAD_STATUS.IDLE]: 'bg-gray-400',
  [UPLOAD_STATUS.UPDATING]: 'bg-gray-500',
  [UPLOAD_STATUS.COMPLETED]: 'bg-green-500',
  [UPLOAD_STATUS.ERROR]: 'bg-red-500',
};

// const logger = createLogger('pages/Control/ProgressBar');
const ProgressBar = ({ value, status }: ProgressBarProps) => {
  /* ======   variables   ====== */

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="w-full bg-gray-200 rounded h-6">
      <div className={`flex items-center relative rounded h-full ${statusClasses[status] ?? 'bg-gray-400'}`}>
        <div className="flex w-full">
          <span className={`text-white text-sm font-medium p-2`} style={{ width: `${value}%` }}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
