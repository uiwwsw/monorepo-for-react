import { Button } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
import ModalUpdate from './Modals/Update';
import { useTcmStart } from '!/controls/application/post-tcm-start';
import { TcmInfo } from '!/control/domain';
import { useTcmStop } from '!/control/application/post-tcm-stop';
import { useTcmRestart } from '!/control/application/post-tcm-restart';
import { useTcmReload } from '!/control/application/post-tcm-reload';
import { useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import useToastsForControl from '#/useToastsForControl';
/* ======   interface   ====== */
export interface TcmSelectProps {
  selectedRows?: Row<TcmInfo>[];
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/TcmSelect');
const TcmSelect = ({ selectedRows }: TcmSelectProps) => {
  /* ======   variables   ====== */
  const { trigger: startTrigger, isMutating: startIsMutating } = useTcmStart();
  const { trigger: stopTrigger, isMutating: stopIsMutating } = useTcmStop();
  const { trigger: restartTrigger, isMutating: restartIsMutating } = useTcmRestart();
  const { trigger: reloadTrigger, isMutating: reloadIsMutating } = useTcmReload();

  const selectedTids = useMemo(() => selectedRows?.map((row) => row.original.tid) || [], [selectedRows]);
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: selectedTids });

  const disabled = useMemo(
    () => !selectedRows?.length || startIsMutating || stopIsMutating || restartIsMutating || reloadIsMutating,
    [selectedRows, startIsMutating, stopIsMutating, restartIsMutating, reloadIsMutating],
  );

  /* ======   function    ====== */
  const handleStartClick = () =>
    adapterEvent({
      startMsg: '선택한 TCM START 중입니다.',
      failMsg(failTids) {
        if (failTids.length === selectedTids.length) return '선택한 TCM 모두 START 실패 하였습니다.';
        return '몇몇 TCM START 실패 = ' + failTids.map((x) => `${x.id}: ${x.message}`).join();
      },
      successMsg: '선택한 TCM 모두 START 성공 하였습니다.',
      event(tid) {
        return startTrigger({ tid });
      },
    });
  const handleStopClick = () =>
    adapterEvent({
      startMsg: '선택한 TCM STOP 중입니다.',
      failMsg(failTids) {
        if (failTids.length === selectedTids.length) return '선택한 TCM 모두 STOP 실패 하였습니다.';
        return '몇몇 TCM STOP 실패 = ' + failTids.map((x) => `${x.id}: ${x.message}`).join();
      },
      successMsg: '선택한 TCM 모두 STOP 성공 하였습니다.',
      event(tid) {
        return stopTrigger({ tid });
      },
    });
  const handleRestartClick = () =>
    adapterEvent({
      startMsg: '선택한 TCM RESTART 중입니다.',
      failMsg(failTids) {
        if (failTids.length === selectedTids.length) return '선택한 TCM 모두 RESTART 실패 하였습니다.';
        return '몇몇 TCM RESTART 실패 = ' + failTids.map((x) => `${x.id}: ${x.message}`).join();
      },
      successMsg: '선택한 TCM 모두 RESTART 성공 하였습니다.',
      event(tid) {
        return restartTrigger({ tid });
      },
    });
  const handleReloadClick = () =>
    adapterEvent({
      startMsg: '선택한 TCM RELOAD 중입니다.',
      failMsg(failTids) {
        if (failTids.length === selectedTids.length) return '선택한 TCM 모두 RELOAD 실패 하였습니다.';
        return '몇몇 TCM RELOAD 실패 = ' + failTids.map((x) => `${x.id}: ${x.message}`).join();
      },
      successMsg: '선택한 TCM 모두 RELOAD 성공 하였습니다.',
      event(tid) {
        return reloadTrigger({ tid });
      },
    });

  /* ======   useEffect   ====== */
  return (
    <>
      <Toasts />
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

        <ModalUpdate disabled={disabled} selectedRows={selectedTids} />
      </div>
    </>
  );
};

export default TcmSelect;
