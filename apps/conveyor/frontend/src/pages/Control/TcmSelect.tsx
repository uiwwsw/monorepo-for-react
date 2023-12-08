import { Button } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
import ModalUpdate from './Modals/Update';
import { useTcmStart } from '!/control/application/post-tcm-start';
import { useTcmStop } from '!/control/application/post-tcm-stop';
import { useTcmReStart } from '!/control/application/post-tcm-restart';
import { useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import useToastsForControl from '#/useToastsForControl';
import { TcmList } from '!/control/domain';
/* ======   interface   ====== */
export interface TcmSelectProps {
  selectedRows?: Row<TcmList>[];
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/TcmSelect');
const TcmSelect = ({ selectedRows }: TcmSelectProps) => {
  /* ======   variables   ====== */
  const { trigger: startTrigger, isMutating: startIsMutating } = useTcmStart();
  const { trigger: stopTrigger, isMutating: stopIsMutating } = useTcmStop();
  const { trigger: restartTrigger, isMutating: restartIsMutating } = useTcmReStart();

  const selectedTids = useMemo(() => selectedRows?.map((row) => row.original.tcmId) || [], [selectedRows]);
  const selectedAdds = useMemo(() => selectedRows?.map((row) => row.original.ipAddress) || [], [selectedRows]);
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: selectedTids });

  const disabled = useMemo(
    () => !selectedRows?.length || startIsMutating || stopIsMutating || restartIsMutating,
    [selectedRows, startIsMutating, stopIsMutating, restartIsMutating],
  );

  /* ======   function    ====== */
  const handleStartClick = () =>
    adapterEvent({
      startMsg: '선택한 TCM START 중입니다.',
      duration: 3000,
      event(TCM_ID) {
        return startTrigger({ TCM_ID });
      },
    });
  const handleStopClick = () =>
    adapterEvent({
      startMsg: '선택한 TCM STOP 중입니다.',
      duration: 10000,
      event(TCM_ID) {
        return stopTrigger({ TCM_ID });
      },
    });
  const handleRestartClick = () =>
    adapterEvent({
      startMsg: '선택한 TCM RESTART 중입니다.',
      duration: 15000,
      event(TCM_ID) {
        return restartTrigger({ TCM_ID });
      },
    });

  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <div className="flex justify-end space-x-2 items-center">
        <Button disabled={disabled} smoothLoading onClick={handleStartClick}>
          Start
        </Button>
        <Button disabled={disabled} themeColor="quaternary" smoothLoading onClick={handleStopClick}>
          Stop
        </Button>
        <Button disabled={disabled} smoothLoading onClick={handleRestartClick}>
          Restart
        </Button>
        <ModalUpdate disabled={disabled} selectedRows={selectedTids} selectedAdds={selectedAdds} />
      </div>
    </>
  );
};

export default TcmSelect;
