import { Button, ModalWithBtn, ToastWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import ModalContentUpdate from './ModalContentUpdate';
import { useTcmStart } from 'src/libs/control/application/post-tcm-start';
import { Status } from 'src/libs/control/domain';
import { useTcmStop } from 'src/libs/control/application/post-tcm-stop';
import { useTcmRestart } from 'src/libs/control/application/post-tcm-restart';
import { useTcmReload } from 'src/libs/control/application/post-tcm-reload';
import { useState } from 'react';
/* ======   interface   ====== */
export interface TcmSelectProps {
  selectedRows?: number[];
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSelect');
const TcmSelect = ({ selectedRows }: TcmSelectProps) => {
  const { trigger: startTrigger } = useTcmStart();
  const { trigger: stopTrigger } = useTcmStop();
  const { trigger: restartTrigger } = useTcmRestart();
  const { trigger: reloadTrigger } = useTcmReload();
  const [toastMessageStart, setToastMessageStart] = useState('');
  const [toastMessageStop, setToastMessageStop] = useState('');
  const [toastMessageRestart, setToastMessageRestart] = useState('');
  const [toastMessageReload, setToastMessageReload] = useState('');
  /* ======   variables   ====== */
  /* ======   function    ====== */
  const handleStartClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageStart('선택한 TCM START 중입니다.');

    const offlineTids = [];

    for (const tid of selectedRows) {
      try {
        const status = await startTrigger({ tid });
        if (status !== Status.ONLINE) {
          offlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        offlineTids.push(tid);
      }
    }

    if (offlineTids.length > 0) {
      logger(`TCM [${offlineTids.join(', ')}] START 실패 하였습니다.`);
      setToastMessageStart(`TCM [${offlineTids.join(', ')}] START 실패 하였습니다.`);
    } else {
      setToastMessageStart(`선택한 TCM 모두 START 성공 하였습니다.`);
    }
  };

  const handleStopClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageStop('선택한 TCM STOP 중입니다.');

    const onlineTids = [];

    for (const tid of selectedRows) {
      try {
        const status = await stopTrigger({ tid });
        if (status !== Status.OFFLINE) {
          onlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        onlineTids.push(tid);
      }
    }

    if (onlineTids.length > 0) {
      logger(`TCM [${onlineTids.join(', ')}] STOP 실패 하였습니다.`);
      setToastMessageStop(`TCM [${onlineTids.join(', ')} STOP] 실패 하였습니다.`);
    } else {
      setToastMessageStop(`선택한 TCM 모두 STOP 성공 하였습니다.`);
    }
  };

  const handleRestartClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageRestart('선택한 TCM RESTART 중입니다.');

    const offlineTids = [];

    for (const tid of selectedRows) {
      try {
        const status = await restartTrigger({ tid });
        if (status !== Status.ONLINE) {
          offlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        offlineTids.push(tid);
      }
    }

    if (offlineTids.length > 0) {
      logger(`TCM [${offlineTids.join(', ')}] RESTART 실패 하였습니다.`);
      setToastMessageRestart(`TCM [${offlineTids.join(', ')}] RESTART 실패 하였습니다.`);
    } else {
      setToastMessageRestart(`선택한 TCM 모두 RESTART 성공 하였습니다.`);
    }
  };

  const handleReloadClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }
    setToastMessageReload('선택한 TCM RELOAD 중입니다.');

    const offlineTids = [];

    for (const tid of selectedRows) {
      try {
        const status = await reloadTrigger({ tid });
        if (status !== Status.ONLINE) {
          offlineTids.push(tid);
        }
      } catch (error) {
        logger(`Error starting TCM with tid ${tid}:`, error);
        offlineTids.push(tid);
      }
    }

    if (offlineTids.length > 0) {
      logger(`TCM [${offlineTids.join(', ')}] RELOAD 실패 하였습니다.`);
      setToastMessageReload(`TCM [${offlineTids.join(', ')}] RELOAD 실패 하였습니다.`);
    } else {
      setToastMessageReload(`선택한 TCM 모두 RELOAD 성공 하였습니다.`);
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
      <ModalWithBtn
        persist
        button={
          <Button themeSize={'sm'} themeColor="tertiary">
            Update
          </Button>
        }
        hasButton={['CANCEL']}
      >
        <ModalContentUpdate selectedRows={selectedRows} />
      </ModalWithBtn>
    </div>
  );
};

export default TcmSelect;
