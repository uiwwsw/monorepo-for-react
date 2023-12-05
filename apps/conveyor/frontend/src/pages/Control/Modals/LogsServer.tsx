import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '#/logger';
import { useServerLogList } from '!/control/application/get-server-log-list';
import H2 from '@/Typography/H2';
import { formatFileSize } from '!/control/domain';
/* ======   interface   ====== */
export interface ModalLogsServerProps {
  sid?: number;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/LogsServer');
const ModalLogsServer = ({ sid }: ModalLogsServerProps) => {
  /* ======   variables   ====== */
  const { trigger, data, isMutating, error } = useServerLogList();
  /* ======   function    ====== */
  const handleClick = () => trigger({ sid });
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>

      <ModalWithBtn
        button={
          <Button themeSize="sm" themeColor={'tertiary'} onClick={handleClick}>
            Logs
          </Button>
        }
        hasButton={['CANCEL']}
        defaultLoading={isMutating}
        hasCloseBtn
      >
        <H2>서버 {sid} 로그</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.map((log, index) => (
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
      </ModalWithBtn>
    </>
  );
};

export default ModalLogsServer;
