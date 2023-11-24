import { useServerLogList } from '!/control/application/get-server-logList';
import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';

interface ModalContentLogsServerProps {
  sid?: number;
}

/* ======    global     ====== */
const logger = createLogger('pages/Control/ModalContentLogsServer');

const ModalContentLogsServer = ({ sid }: ModalContentLogsServerProps) => {
  const { data: logList, error } = useServerLogList(sid);

  if (error) return <div>Failed to load</div>;
  if (!logList) return <div>Loading...</div>;

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  };

  logger('render');
  return (
    <div className="overflow-auto max-h-96">
      <h2 className="text-xl font-bold text-black text-center mb-4">서버 {sid} 로그</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logList.map((log, index) => (
          <div
            key={index}
            className="bg-green-200 text-black p-3 rounded-lg flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:items-center"
          >
            <div className="truncate">
              <div className="font-medium">{log.fileName}</div>
              <div className="text-sm text-black">{formatFileSize(log.fileSize)}</div>
            </div>
            <div className="flex space-x-2">
              <Button themeSize="sm" themeColor="secondary">
                보기
              </Button>
              <Button themeSize="sm" themeColor="secondary">
                다운로드
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalContentLogsServer;
