import { Button } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import ModalFirmware from './Modals/Firmware';
import ModalDetail from './Modals/Detail';
// import { useTcmKill } from '!/control/application/post-tcm-kill';
import ModalLogsTcm from './Modals/LogsTcm';
import useToastsForControl from '#/useToastsForControl';
import { TcmList } from '!/control/domain';
import { useProcessId } from '!/control/application/get-process';
import { useTcmNetwork } from '!/redis/application/get-tcm-network';
import { useTcmKill } from '!/control/application/post-tcm-kill';
import Test from '@/Test';
// import { useTcmNetwork } from '!/redis/application/get-tcm-network';
/* ======   interface   ====== */
export interface TcmSubProps {
  row?: Row<TcmList>;
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/TcmSub');
const TcmSub = ({ row }: TcmSubProps) => {
  /* ======   variables   ====== */
  // const [toastMessages, setToastMessages] = useState<string[]>([]);

  const { trigger: killTrigger } = useTcmKill();
  const { trigger: processTrigger } = useProcessId();
  const { trigger: networkTrigger } = useTcmNetwork();

  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: [row?.original.tcmId] });

  /* ======   function    ====== */

  // const showToast = (msg: string) => setToastMessages((prev) => [...prev, msg]);
  const handleKillClick = () =>
    adapterEvent({
      startMsg: 'TCM 프로세스 Kill 중입니다.',
      failMsg() {
        return `TCM 프로세스 Kill 실패 하였습니다.`;
      },
      successMsg: 'TCM 프로세스 Kill 성공 하였습니다.',
      async event(tcmId) {
        if (!tcmId) return;
        const address = row?.original.ipAddress;
        if (!address) return;
        const port = await networkTrigger({ tcm_id: tcmId });
        const procId = await processTrigger({ address, port });
        if (!procId) return;
        return killTrigger({ address, procId, port: 5000 });
      },
    });

  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <div className="flex justify-end space-x-2 items-center p-2">
        <Button themeSize="sm" onClick={handleKillClick} smoothLoading>
          <Test className="left-0 top-0">Process Kill</Test>
        </Button>

        <ModalFirmware tcmId={row?.original.tcmId} address={row?.original.ipAddress} />

        <ModalDetail tid={row?.original.tcmId} />

        <ModalLogsTcm tcmId={row?.original.tcmId} address={row?.original.ipAddress} />
      </div>
    </>
  );
};

export default TcmSub;
