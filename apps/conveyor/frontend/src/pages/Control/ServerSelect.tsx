import { useServerReload } from '!/control/application/post-server-reload';
import { useServerRestart } from '!/control/application/post-server-restart';
import { useServerStart } from '!/control/application/post-server-start';
import { useServerStop } from '!/control/application/post-server-stop';
import { ResponseResult, ServerInfo } from '!/control/domain';
import { Button, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
/* ======   interface   ====== */
export interface ServerSelectProps {
  selectedRows?: Row<ServerInfo>[];
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/ServerSelect');
const ServerSelect = ({ selectedRows }: ServerSelectProps) => {
  /* ======   variables   ====== */
  const { trigger: startTrigger } = useServerStart();
  const { trigger: stopTrigger } = useServerStop();
  const { trigger: restartTrigger } = useServerRestart();
  const { trigger: reloadTrigger } = useServerReload();
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  const selectedSids = useMemo(() => selectedRows?.map((row) => row.original.sid) || [], [selectedRows]);
  const disabled = useMemo(() => !selectedRows?.length, [selectedRows]);
  /* ======   function    ====== */
  const showToast = (msg: string) => setToastMessages((prev) => [...prev, msg]);

  const handleStartClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 서버 START 중입니다.');

    const offlineSids = [];

    for (const sid of selectedSids) {
      try {
        const status = await startTrigger({ sid });
        if (status?.result !== ResponseResult.SUCCESS) {
          offlineSids.push(sid);
        }
      } catch (error) {
        logger(`Error starting 서버 with sid ${sid}:`, error);
        offlineSids.push(sid);
      }
    }

    if (offlineSids.length > 0) {
      logger(`서버 [${offlineSids.join(', ')}] START 실패 하였습니다.`);
      showToast(`서버 [${offlineSids.join(', ')}] START 실패 하였습니다.`);
    } else {
      showToast(`선택한 서버 모두 START 성공 하였습니다.`);
    }
  };

  const handleStopClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 서버 STOP 중입니다.');

    const onlineSids = [];

    for (const sid of selectedSids) {
      try {
        const status = await stopTrigger({ sid });
        if (status?.result !== ResponseResult.SUCCESS) {
          onlineSids.push(sid);
        }
      } catch (error) {
        logger(`Error starting 서버 with sid ${sid}:`, error);
        onlineSids.push(sid);
      }
    }

    if (onlineSids.length > 0) {
      logger(`서버 [${onlineSids.join(', ')}] STOP 실패 하였습니다.`);
      showToast(`서버 [${onlineSids.join(', ')}] STOP 실패 하였습니다.`);
    } else {
      showToast(`선택한 서버 모두 STOP 성공 하였습니다.`);
    }
  };

  const handleRestartClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 서버 RESTART 중입니다.');

    const offlineSids = [];

    for (const sid of selectedSids) {
      try {
        const status = await restartTrigger({ sid });
        if (status?.result !== ResponseResult.SUCCESS) {
          offlineSids.push(sid);
        }
      } catch (error) {
        logger(`Error starting 서버 with sid ${sid}:`, error);
        offlineSids.push(sid);
      }
    }

    if (offlineSids.length > 0) {
      logger(`서버 [${offlineSids.join(', ')}] RESTART 실패 하였습니다.`);
      showToast(`서버 [${offlineSids.join(', ')}] RESTART 실패 하였습니다.`);
    } else {
      showToast(`선택한 서버 모두 RESTART 성공 하였습니다.`);
    }
  };

  const handleReloadClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    showToast('선택한 서버 RELOAD 중입니다.');

    const offlineSids = [];

    for (const sid of selectedSids) {
      try {
        const status = await reloadTrigger({ sid });
        if (status?.result !== ResponseResult.SUCCESS) {
          offlineSids.push(sid);
        }
      } catch (error) {
        logger(`Error starting 서버 with sid ${sid}:`, error);
        offlineSids.push(sid);
      }
    }

    if (offlineSids.length > 0) {
      logger(`서버 [${offlineSids.join(', ')}] RELOAD 실패 하였습니다.`);
      showToast(`서버 [${offlineSids.join(', ')}] RELOAD 실패 하였습니다.`);
    } else {
      showToast(`선택한 서버 모두 RELOAD 성공 하였습니다.`);
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
      </div>
    </>
  );
};

export default ServerSelect;
