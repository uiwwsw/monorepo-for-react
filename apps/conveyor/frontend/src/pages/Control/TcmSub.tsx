import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { ResponseResult, TcmInfo } from '!/control/domain';
import ModalContentFirmware from './ModalContentFirmware';
import ModalContentDetail from './ModalContentDetail';
import { useState } from 'react';
import { useTcmKill } from '!/control/application/post-tcm-kill';
import ModalContentLogsTcm from './ModalContentLogsTcm';
/* ======   interface   ====== */
export interface TcmSubProps {
  row?: Row<TcmInfo>;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSub');
const TcmSub = ({ row }: TcmSubProps) => {
  /* ======   variables   ====== */
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  const { trigger: killTrigger } = useTcmKill();

  /* ======   function    ====== */
  const showToast = (msg: string) => setToastMessages((prev) => [...prev, msg]);
  const handleKillClick = async () => {
    if (!row || (row.original && typeof row.original.tid !== 'number')) return;

    showToast('TCM 프로세스 Kill 중입니다.');
    try {
      const status = await killTrigger({ tid: row?.original.tid });
      if (status?.result === ResponseResult.SUCCESS) {
        showToast(`TCM 프로세스 Kill 완료`);
      } else {
        showToast(`TCM 프로세스 Kill 실패, ${status?.reason}`);
      }
    } catch (error) {
      showToast(`${error}`);
    }
  };

  logger('render');
  /* ======   useEffect   ====== */
  return (
    <>
      {toastMessages.map((x) => (
        <ToastWithPortal open>{x}</ToastWithPortal>
      ))}
      <div className="flex justify-end space-x-2 items-center p-2">
        <Button themeSize="sm" onClick={handleKillClick}>
          Process Kill
        </Button>

        <ModalWithBtn
          button={
            <Button themeSize={'sm'} themeColor={'tertiary'}>
              Firmware
            </Button>
          }
          hasButton={['CANCEL']}
          persist
        >
          <ModalContentFirmware tid={row?.original.tid} />
        </ModalWithBtn>

        <ModalWithBtn
          button={
            <Button themeSize={'sm'} themeColor={'tertiary'}>
              Alive
            </Button>
          }
          hasButton={['CANCEL']}
          persist
        >
          <ModalContentDetail tid={row?.original.tid} clientStatus={row?.original.adjTcmConnectionDetail} />
        </ModalWithBtn>

        <ModalWithBtn
          button={
            <Button themeSize={'sm'} themeColor={'tertiary'}>
              Logs
            </Button>
          }
          hasButton={['CANCEL']}
          persist
        >
          <ModalContentLogsTcm tid={row?.original.tid} />
        </ModalWithBtn>
      </div>
    </>
  );
};

export default TcmSub;
