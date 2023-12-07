import { useServerReStart } from '!/control/application/post-server-restart';
import { useServerStart } from '!/control/application/post-server-start';
import { useServerStop } from '!/control/application/post-server-stop';
import useToastsForControl from '#/useToastsForControl';
import { Button } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ServerList } from '!/control/domain';
/* ======   interface   ====== */
export interface ServerSelectProps {
  selectedRows?: Row<ServerList>[];
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/ServerSelect');
const ServerSelect = ({ selectedRows }: ServerSelectProps) => {
  /* ======   variables   ====== */
  const { trigger: startTrigger, isMutating: startIsMutating } = useServerStart();
  const { trigger: stopTrigger, isMutating: stopIsMutating } = useServerStop();
  const { trigger: restartTrigger, isMutating: restartIsMutating } = useServerReStart();

  const selectedSids = useMemo(() => selectedRows?.map((row) => row.original.stateType) || [], [selectedRows]);
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: selectedSids });
  const disabled = useMemo(
    () => !selectedRows?.length || startIsMutating || stopIsMutating || restartIsMutating,
    [selectedRows, startIsMutating, stopIsMutating, restartIsMutating],
  );
  /* ======   function    ====== */

  const handleStartClick = () =>
    adapterEvent({
      startMsg: '선택한 서버 START 중입니다.',
      event(type) {
        return startTrigger(type);
      },
    });
  const handleStopClick = () =>
    adapterEvent({
      startMsg: '선택한 서버 STOP 중입니다.',
      event(type) {
        return stopTrigger(type);
      },
    });

  const handleRestartClick = () =>
    adapterEvent({
      startMsg: '선택한 서버 RESTART 중입니다.',
      event(type) {
        return restartTrigger(type);
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
      </div>
    </>
  );
};

export default ServerSelect;
