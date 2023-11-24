import { useServerReload } from '!/control/application/post-server-reload';
import { useServerRestart } from '!/control/application/post-server-restart';
import { useServerStart } from '!/control/application/post-server-start';
import { useServerStop } from '!/control/application/post-server-stop';
import { ResponseResult, ServerInfo } from '!/control/domain';
import { Button, ToastWithBtn } from '@library-frontend/ui';
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
  const [toastMessageStart, setToastMessageStart] = useState('');
  const [toastMessageStop, setToastMessageStop] = useState('');
  const [toastMessageRestart, setToastMessageRestart] = useState('');
  const [toastMessageReload, setToastMessageReload] = useState('');
  const selectedSids = useMemo(() => {
    return selectedRows?.map((row) => row.original.sid) || [];
  }, [selectedRows]);
  /* ======   function    ====== */
  const handleStartClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageStart('선택한 서버 START 중입니다.');

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
      setToastMessageStart(`서버 [${offlineSids.join(', ')}] START 실패 하였습니다.`);
    } else {
      setToastMessageStart(`선택한 서버 모두 START 성공 하였습니다.`);
    }
  };

  const handleStopClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageStop('선택한 서버 STOP 중입니다.');

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
      setToastMessageStop(`서버 [${onlineSids.join(', ')}] STOP 실패 하였습니다.`);
    } else {
      setToastMessageStop(`선택한 서버 모두 STOP 성공 하였습니다.`);
    }
  };

  const handleRestartClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageRestart('선택한 서버 RESTART 중입니다.');

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
      setToastMessageRestart(`서버 [${offlineSids.join(', ')}] RESTART 실패 하였습니다.`);
    } else {
      setToastMessageRestart(`선택한 서버 모두 RESTART 성공 하였습니다.`);
    }
  };

  const handleReloadClick = async () => {
    if (!selectedSids || selectedSids.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageReload('선택한 서버 RELOAD 중입니다.');

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
      setToastMessageReload(`서버 [${offlineSids.join(', ')}] RELOAD 실패 하였습니다.`);
    } else {
      setToastMessageReload(`선택한 서버 모두 RELOAD 성공 하였습니다.`);
    }
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end space-x-2 items-center">
      <ToastWithBtn
        button={
          <Button themeSize={'sm'} onClick={handleStartClick}>
            Start
          </Button>
        }
        duration={Infinity}
      >
        {toastMessageStart}
      </ToastWithBtn>
      <ToastWithBtn
        button={
          <Button themeSize={'sm'} onClick={handleStopClick}>
            Stop
          </Button>
        }
        duration={Infinity}
      >
        {toastMessageStop}
      </ToastWithBtn>
      <ToastWithBtn
        button={
          <Button themeSize={'sm'} onClick={handleRestartClick}>
            Restart
          </Button>
        }
        duration={Infinity}
      >
        {toastMessageRestart}
      </ToastWithBtn>
      <ToastWithBtn
        button={
          <Button themeSize={'sm'} onClick={handleReloadClick}>
            Reload
          </Button>
        }
        duration={Infinity}
      >
        {toastMessageReload}
      </ToastWithBtn>
    </div>
  );
};

export default ServerSelect;
