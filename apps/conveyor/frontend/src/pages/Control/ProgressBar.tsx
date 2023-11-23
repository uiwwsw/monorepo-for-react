import { createLogger } from '@package-frontend/utils';
import { UploadStatus } from 'src/libs/control/domain';

/* ======   interface   ====== */

export interface ProgressBarProps {
  value: number;
  status: UploadStatus;
}

/* ======    global     ====== */
const getStatusColorClass = (status: UploadStatus) => {
  const statusClasses = {
    [UploadStatus.Idle]: 'bg-gray-400',
    [UploadStatus.Updating]: 'bg-gray-500',
    [UploadStatus.Completed]: 'bg-green-500',
    [UploadStatus.Error]: 'bg-red-500',
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
