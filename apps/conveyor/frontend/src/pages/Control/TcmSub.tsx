import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { TcmInfo } from '!/control/domain';
import ModalFirmware from './Modals/Firmware';
import ModalDetail from './Modals/Detail';
import { useTcmKill } from '!/control/application/post-tcm-kill';
import ModalLogsTcm from './Modals/LogsTcm';
import useToastsForControl from '#/useToastsForControl';
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
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: [row?.original.tid] });

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
        <Button themeSize="sm" onClick={handleKillClick} smoothLoading>
          Process Kill
        </Button>

        <ModalFirmware tid={row?.original.tid} />

        <ModalDetail tid={row?.original.tid} clientStatus={row?.original.adjTcmConnectionDetail} />

        <ModalLogsTcm tid={row?.original.tid} />
      </div>
    </>
  );
};

export default TcmSub;
