import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import ModalContentUpdate from './ModalContentUpdate';
import { useTcmStart } from '!/control/application/post-tcm-start';
import { ResponseResult, TcmInfo } from '!/control/domain';
import { useTcmStop } from '!/control/application/post-tcm-stop';
import { useTcmRestart } from '!/control/application/post-tcm-restart';
import { useTcmReload } from '!/control/application/post-tcm-reload';
import { useMemo, useState } from 'react';
import { Row } from '@tanstack/react-table';
/* ======   interface   ====== */
export interface TcmSelectProps {
  selectedRows?: Row<TcmInfo>[];
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSelect');
const TcmSelect = ({ selectedRows }: TcmSelectProps) => {
  /* ======   variables   ====== */
  const { trigger: startTrigger } = useTcmStart();
  const { trigger: stopTrigger } = useTcmStop();
  const { trigger: restartTrigger } = useTcmRestart();
  const { trigger: reloadTrigger } = useTcmReload();
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  const selectedTids = useMemo(() => selectedRows?.map((row) => row.original.tid) || [], [selectedRows]);
  const disabled = useMemo(() => !selectedRows?.length, [selectedRows]);

  /* ======   function    ====== */
  const showToast = (msg: string) => setToastMessages((prev) => [...prev, msg]);

  const handleStartClick = async () => {
    if (!selectedTids || selectedTids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 TCM START 중입니다.');

    const offlineTids = [];

    for (const tid of selectedTids) {
      try {
        const status = await startTrigger({ tid });
        if (status?.result !== ResponseResult.SUCCESS) {
          offlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        offlineTids.push(tid);
      }
    }

    if (offlineTids.length > 0) {
      logger(`TCM [${offlineTids.join(', ')}] START 실패 하였습니다.`);
      showToast(`TCM [${offlineTids.join(', ')}] START 실패 하였습니다.`);
    } else {
      showToast(`선택한 TCM 모두 START 성공 하였습니다.`);
    }
  };

  const handleStopClick = async () => {
    if (!selectedTids || selectedTids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 TCM STOP 중입니다.');

    const onlineTids = [];

    for (const tid of selectedTids) {
      try {
        const status = await stopTrigger({ tid });
        if (status?.result !== ResponseResult.SUCCESS) {
          onlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        onlineTids.push(tid);
      }
    }

    if (onlineTids.length > 0) {
      logger(`TCM [${onlineTids.join(', ')}] STOP 실패 하였습니다.`);
      showToast(`TCM [${onlineTids.join(', ')}] STOP 실패 하였습니다.`);
    } else {
      showToast(`선택한 TCM 모두 STOP 성공 하였습니다.`);
    }
  };

  const handleRestartClick = async () => {
    if (!selectedTids || selectedTids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 TCM RESTART 중입니다.');

    const offlineTids = [];

    for (const tid of selectedTids) {
      try {
        const status = await restartTrigger({ tid });
        if (status?.result !== ResponseResult.SUCCESS) {
          offlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        offlineTids.push(tid);
      }
    }

    if (offlineTids.length > 0) {
      logger(`TCM [${offlineTids.join(', ')}] RESTART 실패 하였습니다.`);
      showToast(`TCM [${offlineTids.join(', ')}] RESTART 실패 하였습니다.`);
    } else {
      showToast(`선택한 TCM 모두 RESTART 성공 하였습니다.`);
    }
  };

  const handleReloadClick = async () => {
    if (!selectedTids || selectedTids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 TCM RELOAD 중입니다.');

    const offlineTids = [];

    for (const tid of selectedTids) {
      try {
        const status = await reloadTrigger({ tid });
        if (status?.result !== ResponseResult.SUCCESS) {
          offlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        offlineTids.push(tid);
      }
    }

    if (offlineTids.length > 0) {
      logger(`TCM [${offlineTids.join(', ')}] RELOAD 실패 하였습니다.`);
      showToast(`TCM [${offlineTids.join(', ')}] RELOAD 실패 하였습니다.`);
    } else {
      showToast(`선택한 TCM 모두 RELOAD 성공 하였습니다.`);
    }
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      {toastMessages.map((x) => (
        <ToastWithPortal open>{x}</ToastWithPortal>
      ))}
      <div className="flex justify-end space-x-2 items-center">
        <Button disabled={disabled} themeSize={'sm'} onClick={handleStartClick}>
          Start
        </Button>
        <Button disabled={disabled} themeSize={'sm'} onClick={handleStopClick}>
          Stop
        </Button>
        <Button disabled={disabled} themeSize={'sm'} onClick={handleRestartClick}>
          Restart
        </Button>
        <Button disabled={disabled} themeSize={'sm'} onClick={handleReloadClick}>
          Reload
        </Button>
        <ModalWithBtn
          persist
          button={
            <Button disabled={disabled} themeSize={'sm'} themeColor="tertiary">
              Update
            </Button>
          }
          hasButton={['CANCEL']}
        >
          <ModalContentUpdate selectedRows={selectedTids} />
        </ModalWithBtn>
      </div>
    </>
  );
};

export default TcmSelect;
