import { Button, ModalWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { TcmInfo } from '!/control/domain';
import ModalContentFirmware from './ModalContentFirmware';
import ModalContentDetail from './ModalContentDetail';
import { useTcmKill } from '!/control/application/post-tcm-kill';
import ModalContentLogsTcm from './ModalContentLogsTcm';
import useToasts from '#/useToasts';
/* ======   interface   ====== */
export interface TcmSubProps {
  row?: Row<TcmInfo>;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSub');
const TcmSub = ({ row }: TcmSubProps) => {
  /* ======   variables   ====== */
  // const [toastMessages, setToastMessages] = useState<string[]>([]);

  const { trigger: killTrigger } = useTcmKill();
  const { Toasts, adapterEvent } = useToasts({ selectedRows: [row?.original.tid] });

  /* ======   function    ====== */

  // const showToast = (msg: string) => setToastMessages((prev) => [...prev, msg]);
  const handleKillClick = () =>
    adapterEvent({
      startMsg: 'TCM 프로세스 Kill 중입니다.',
      failMsg() {
        return `TCM 프로세스 Kill 실패 하였습니다.`;
      },
      successMsg: 'TCM 프로세스 Kill 성공 하였습니다.',
      event(tid) {
        return killTrigger({ tid });
      },
    });

  logger('render');
  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
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
