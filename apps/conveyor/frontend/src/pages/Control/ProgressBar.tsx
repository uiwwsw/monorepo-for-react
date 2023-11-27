import { createLogger } from '@package-frontend/utils';
import { UPLOAD_STATUS } from 'src/libs/control/domain';

/* ======   interface   ====== */

export interface ProgressBarProps {
  value: number;
  status: UPLOAD_STATUS;
}

/* ======    global     ====== */
const getStatusColorClass = (status: UPLOAD_STATUS) => {
  const statusClasses = {
    IDLE: 'bg-gray-400',
    UPDATING: 'bg-gray-500',
    COMPLETE: 'bg-green-500',
    ERROR: 'bg-red-500',
    default: 'bg-gray-400',
  };
  return statusClasses[status] || statusClasses.default;
};

const getWidth = (value: number) => `${value}%`;

const logger = createLogger('pages/Control/ProgressBar');
const ProgressBar = ({ value, status }: ProgressBarProps) => {
  /* ======   variables   ====== */
  const statusColorClass = getStatusColorClass(status);
  const width = getWidth(value);

  /* ======   function    ====== */
  logger('render');
  /* ======   useEffect   ====== */
  return (
    <div className="w-full bg-gray-200 rounded h-6">
      <div className={`flex items-center relative rounded h-full ${statusColorClass}`}>
        <div className="flex w-full">
          <span className={`text-white text-sm font-medium p-2`} style={{ width }}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
