import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useServerLogList } from '!/control/application/get-server-log-list';
import H2 from '@/Typography/H2';
import { SERVER_TYPE } from '!/control/domain';
import { useServerLog } from '!/control/application/get-server-log';
import { useTranslation } from 'react-i18next';
// import { formatFileSize } from '!/control/domain';
/* ======   interface   ====== */
export interface ModalLogsServerProps {
  stateType?: SERVER_TYPE;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/LogsServer');
const ModalLogsServer = ({ stateType }: ModalLogsServerProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const {
    trigger: logListTrigger,
    data: logListData,
    isMutating: isLogListMutating,
    error: logListError,
  } = useServerLogList();
  const { trigger: logTrigger } = useServerLog();
  /* ======   function    ====== */
  const handleOpenLogModal = () => {
    logListTrigger();
    logger('handleOpenLogModal');
  };
  const handleDownload = async (fileName: string) => {
    const blob = await logTrigger({ fileName });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // 저장할 파일 이름
    document.body.appendChild(a);
    a.click(); // 프로그래밍 방식으로 클릭 이벤트 발생
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // URL 해제
    logger('handleDownload');
  };
  const handleView = async (fileName: string) => {
    const blob = await logTrigger({ fileName });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click(); // 프로그래밍 방식으로 클릭 이벤트 발생
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // URL 해제
    logger('handleView');
  };
  /* ======   useEffect   ====== */
  return (
    <>
      <ToastWithPortal open={logListError?.message}>{logListError?.message}</ToastWithPortal>

      <ModalWithBtn
        button={
          <Button themeSize="sm" themeColor={'tertiary'} onClick={handleOpenLogModal}>
            {t('Logs')}
          </Button>
        }
        hasButton={['CANCEL']}
        defaultLoading={isLogListMutating}
        hasCloseBtn
      >
        <H2>{t('서버 {{stateType}} 로그', { stateType })}</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logListData?.map((fileName, index) => (
            <div
              key={index}
              className="bg-green-200 text-black p-3 rounded-lg flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:items-center"
            >
              <div className="truncate">
                <div className="font-medium">{fileName}</div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleView(fileName)} themeSize="sm" themeColor="secondary">
                  {t('보기')}
                </Button>
                <Button onClick={() => handleDownload(fileName)} themeSize="sm" themeColor="secondary">
                  {t('다운로드')}
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
