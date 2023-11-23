import { clientStatus, ConnectionStatus } from '!/control/domain';
import { createLogger } from '@package-frontend/utils';

interface ModalContentDetailProps {
  clientStatus?: clientStatus[];
  tid?: number;
}

/* ======    global     ====== */
const logger = createLogger('pages/ModalContentDetail');

const ModalContentDetail = ({ clientStatus, tid }: ModalContentDetailProps) => {
  /* ======   variables   ====== */

  /* ======   function    ====== */

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">TCM {tid} 연결상태</h2>
      <div className="flex flex-wrap overflow-y-auto max-h-64 max-w-xl">
        {clientStatus?.map((status, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg m-2">
            <span className="text-md font-medium">TCM {status.tid} :</span>
            <span
              className={`font-semibold text-md ml-4 ${
                status.cstatus === ConnectionStatus.ON ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {status.cstatus}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ModalContentDetail;
