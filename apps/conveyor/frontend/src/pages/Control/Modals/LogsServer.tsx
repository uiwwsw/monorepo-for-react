import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger, onDownload, onView } from '@package-frontend/utils';
import { useServerLogList } from '!/control/application/get-server-log-list';
import H2 from '@/Typography/H2';
import { SERVER_TYPE } from '!/control/domain';
import { useServerLog } from '!/control/application/get-server-log';
import { useTranslation } from 'react-i18next';
// import { useEffect } from 'react';
import Empty from '@/Empty';
import useSetting from '#/useSetting';
import Logs from '../Logs';
// import { formatFileSize } from '!/control/domain';
/* ======   interface   ====== */
export interface ModalLogsServerProps {
  stateType?: SERVER_TYPE;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/LogsServer');
const ModalLogsServer = ({ stateType }: ModalLogsServerProps) => {
  /* ======   variables   ====== */
  const { logBrowser, logBrowserMultiple } = useSetting();
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
    onDownload(blob, fileName);
    logger('handleDownload');
  };
  const handleView = async (fileName: string) => {
    const blob = await logTrigger({ fileName });

    onView(blob, logBrowser ? `log-view${logBrowserMultiple ? `-${fileName}` : ''}` : '');
    logger('handleView');
  };
  /* ======   useEffect   ====== */

  return (
    <>
      <ToastWithPortal open={logListError?.message}>{logListError?.message}</ToastWithPortal>
      {/* <Tutorial/> */}
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
        <H2>{t('{{stateType}} 로그', { stateType })}</H2>
        <Logs list={logListData} onDownload={handleDownload} onView={handleView} />
      </ModalWithBtn>
    </>
  );
};

export default ModalLogsServer;
