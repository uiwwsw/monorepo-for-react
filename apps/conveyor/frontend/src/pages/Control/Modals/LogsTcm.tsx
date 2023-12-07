import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useTcmLogList } from '!/control/application/get-tcm-log-list';
import H2 from '@/Typography/H2';
import { useTcmLog } from '!/control/application/get-tcm-log';
import { useTranslation } from 'react-i18next';
import { useTcmNetwork } from '!/redis/application/get-tcm-network';
// import { formatFileSize } from '!/control/domain';
/* ======   interface   ====== */
export interface ModalLogsTcmProps {
  tcmId?: number;
  address?: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/LogsTcm');
const ModalLogsTcm = ({ tcmId, address }: ModalLogsTcmProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { trigger: networkTrigger, data: port } = useTcmNetwork();
  const {
    trigger: logListTrigger,
    data: logListData,
    isMutating: isLogListMutating,
    error: logListError,
  } = useTcmLogList();
  const { trigger: logTrigger } = useTcmLog();
  /* ======   function    ====== */
  const handleOpenLogModal = async () => {
    if (!tcmId) return;
    const port = await networkTrigger({ tcm_id: tcmId });
    logListTrigger({ port: port!, address: address! });
    logger('handleOpenLogModal');
  };
  const handleDownload = async (fileName: string) => {
    const blob = await logTrigger({ fileName, port: port!, address: address! });
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
    const blob = await logTrigger({ fileName, port: port!, address: address! });

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
        <H2>{t('TCM {{tcmId}} 로그', { tcmId })}</H2>
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

export default ModalLogsTcm;
