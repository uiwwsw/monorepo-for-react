import { useServerReload } from '!/control/application/post-server-reload';
import { useServerRestart } from '!/control/application/post-server-restart';
import { useServerStart } from '!/control/application/post-server-start';
import { useServerStop } from '!/control/application/post-server-stop';
import { ServerInfo } from '!/control/domain';
import useToastsForControl from '#/useToastsForControl';
import { Button } from '@library-frontend/ui';
import { createLogger } from '#/logger';
import { Row } from '@tanstack/react-table';
import { useMemo } from 'react';
/* ======   interface   ====== */
export interface ServerSelectProps {
  selectedRows?: Row<ServerInfo>[];
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/ServerSelect');
const ServerSelect = ({ selectedRows }: ServerSelectProps) => {
  /* ======   variables   ====== */
  const { trigger: startTrigger, isMutating: startIsMutating } = useServerStart();
  const { trigger: stopTrigger, isMutating: stopIsMutating } = useServerStop();
  const { trigger: restartTrigger, isMutating: restartIsMutating } = useServerRestart();
  const { trigger: reloadTrigger, isMutating: reloadIsMutating } = useServerReload();

  const selectedSids = useMemo(() => selectedRows?.map((row) => row.original.sid) || [], [selectedRows]);
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: selectedSids });
  const disabled = useMemo(
    () => !selectedRows?.length || startIsMutating || stopIsMutating || restartIsMutating || reloadIsMutating,

    [selectedRows, startIsMutating, stopIsMutating, restartIsMutating, reloadIsMutating],
  );
  /* ======   function    ====== */

  const handleStartClick = () =>
    adapterEvent({
      startMsg: '선택한 서버 START 중입니다.',
      successMsg: '선택한 서버 모두 START 성공 하였습니다.',
      failMsg(failTids) {
        if (failTids.length === selectedSids.length) return '선택한 서버 모두 START 실패 하였습니다.';
        return '몇몇 서버 START 실패 = ' + failTids.map((x) => `${x.id}: ${x.message}`).join();
      },
      event(sid) {
        return startTrigger({ sid });
      },
    });
  const handleStopClick = () =>
    adapterEvent({
      startMsg: '선택한 서버 STOP 중입니다.',
      successMsg: '선택한 서버 모두 STOP 성공 하였습니다.',
      failMsg(failTids) {
        if (failTids.length === selectedSids.length) return '선택한 서버 모두 STOP 실패 하였습니다.';
        return '몇몇 서버 STOP 실패 = ' + failTids.map((x) => `${x.id}: ${x.message}`).join();
      },
      event(sid) {
        return stopTrigger({ sid });
      },
    });

  const handleRestartClick = () =>
    adapterEvent({
      startMsg: '선택한 서버 RESTART 중입니다.',
      successMsg: '선택한 서버 모두 RESTART 성공 하였습니다.',
      failMsg(failSids) {
        return `서버 ${failSids} RESTART 실패 하였습니다.`;
      },
      event(sid) {
        return restartTrigger({ sid });
      },
    });

  const handleReloadClick = () =>
    adapterEvent({
      startMsg: '선택한 서버 RELOAD 중입니다.',
      successMsg: '선택한 서버 모두 RELOAD 성공 하였습니다.',
      failMsg(failSids) {
        return `서버 ${failSids} RELOAD 실패 하였습니다.`;
      },
      event(sid) {
        return reloadTrigger({ sid });
      },
    });

  /* ======   useEffect   ====== */
  logger('render');
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

        <Button disabled={disabled} smoothLoading onClick={handleReloadClick}>
          Reload
        </Button>
      </div>
    </>
  );
};

export default ServerSelect;
