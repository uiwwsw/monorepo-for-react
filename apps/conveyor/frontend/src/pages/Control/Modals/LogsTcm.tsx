import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger, onDownload, onView } from '@package-frontend/utils';
import { useTcmLogList } from '!/control/application/get-tcm-log-list';
import H2 from '@/Typography/H2';
import { useTcmLog } from '!/control/application/get-tcm-log';
import { useTranslation } from 'react-i18next';
import { useTcmNetwork } from '!/redis/application/get-tcm-network';
import useSetting from '#/useSetting';
import ControlLogs from '../Logs';
// import { formatFileSize } from '!/control/domain';
/* ======   interface   ====== */
export interface ControlModalLogsTcmProps {
  tcmId?: number;
  address?: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/LogsTcm');
const ControlModalLogsTcm = ({ tcmId, address }: ControlModalLogsTcmProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { logBrowser, logBrowserMultiple } = useSetting();

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
    onDownload(blob, fileName);

    logger('handleDownload');
  };
  const handleView = async (fileName: string) => {
    const blob = await logTrigger({ fileName, port: port!, address: address! });
    onView(blob, logBrowser ? `log-view${logBrowserMultiple ? `-${fileName}` : ''}` : '');

    logger('handleView');
  };
  /* ======   useEffect   ====== */
  return (
    <>
      <ToastWithPortal open={logListError?.message}>{logListError?.message}</ToastWithPortal>

      <ModalWithBtn
        button={
          <Button themeSize="sm" themeColor={'tertiary'} onClick={handleOpenLogModal}>
            {t('로그')}
          </Button>
        }
        defaultLoading={isLogListMutating}
        hasCloseBtn
      >
        <H2>
          TCM {tcmId} {t('로그')}
        </H2>
        <ControlLogs list={logListData} onDownload={handleDownload} onView={handleView} />
      </ModalWithBtn>
    </>
  );
};

export default ControlModalLogsTcm;
