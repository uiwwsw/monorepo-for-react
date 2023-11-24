import { Button, ModalWithBtn, ToastWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { ReponseResult, TcmInfo } from 'src/libs/control/domain';
import ModalContentFirmware from './ModalContentFirmware';
import ModalContentDetail from './ModalContentDetail';
import ModalContentLogs from './ModalContentLogs';
import { useState } from 'react';
import { useTcmKill } from '!/control/application/post-tcm-kill';
/* ======   interface   ====== */
export interface TcmSubProps {
  row?: Row<TcmInfo>;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSub');
const TcmSub = ({ row }: TcmSubProps) => {
  /* ======   variables   ====== */
  const [toastMessageKill, setToastMessageKill] = useState('');
  const { trigger: killTrigger } = useTcmKill();

  /* ======   function    ====== */
  const handleKillClick = async () => {
    if (!row || (row.original && typeof row.original.tid !== 'number')) return;

    setToastMessageKill('TCM 프로세스 Kill 중입니다.');
    try {
      const status = await killTrigger({ tid: row?.original.tid });
      if (status?.result === ReponseResult.SUCCESS) {
        setToastMessageKill(`TCM 프로세스 Kill 완료`);
      } else {
        setToastMessageKill(`TCM 프로세스 Kill 실패, ${status?.reason}`);
      }
    } catch (error) {
      setToastMessageKill(`${error}`);
    }
  };

  logger('render');
  /* ======   useEffect   ====== */
  return (
    <div className="flex justify-end space-x-2 items-center p-2">
      <ToastWithBtn
        button={
          <Button themeSize="sm" onClick={handleKillClick}>
            Process Kill
          </Button>
        }
        duration={Infinity}
      >
        {toastMessageKill}
      </ToastWithBtn>

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
        <ModalContentLogs tid={row?.original.tid} />
      </ModalWithBtn>
    </div>
  );
};

export default TcmSub;
