import { createLogger } from '@package-frontend/utils';
import { UpdateStatus } from 'src/libs/control/domain';

/* ======   interface   ====== */

export interface ProgressBarProps {
  value: number;
  status: UpdateStatus;
}

/* ======    global     ====== */
const getStatusColorClass = (status: UpdateStatus) => {
  const statusClasses = {
    [UpdateStatus.Idle]: 'bg-gray-400',
    [UpdateStatus.Updating]: 'bg-gray-500',
    [UpdateStatus.Completed]: 'bg-green-500',
    [UpdateStatus.Error]: 'bg-red-500',
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
    <div className="w-full bg-gray-200 rounded overflow-hidden">
      <div className={`flex items-center relative rounded h-4 ${statusColorClass}`} style={{ width }}>
        <span className="absolute w-full justify-center flex text-white text-sm">{status}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
