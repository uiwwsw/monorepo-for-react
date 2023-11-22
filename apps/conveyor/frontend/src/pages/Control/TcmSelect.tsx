import { Button, ModalWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import ModalContentUpdate from './ModalContentUpdate';
import { useTcmStart } from 'src/libs/control/application/useTcmStart';
import { Status } from 'src/libs/control/domain';
import { useTcmStop } from 'src/libs/control/application/useTcmStop';
import { useTcmRestart } from 'src/libs/control/application/useTcmRestart';
import { useTcmReload } from 'src/libs/control/application/useTcmReload';
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
  /* ======   variables   ====== */
  /* ======   function    ====== */
  const handleStartClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }

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
      logger(`TCMs with tids ${offlineTids.join(', ')} are not ONLINE.`);
    }
  };

  const handleStopClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }

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
      logger(`TCMs with tids ${onlineTids.join(', ')} are not OFFLINE.`);
    }
  };

  const handleRestartClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }

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
      logger(`TCMs with tids ${offlineTids.join(', ')} are not ONLINE.`);
    }
  };

  const handleReloadClick = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      logger('No rows selected');
      return;
    }

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
      logger(`TCMs with tids ${offlineTids.join(', ')} are not ONLINE.`);
    }
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-end space-x-2 items-center">
      <Button themeSize={'sm'} onClick={handleStartClick}>
        Start
      </Button>
      <Button themeSize={'sm'} onClick={handleStopClick}>
        Stop
      </Button>
      <Button themeSize={'sm'} onClick={handleRestartClick}>
        Restart
      </Button>
      <Button themeSize={'sm'} onClick={handleReloadClick}>
        Reload
      </Button>
      <ModalWithBtn persist button={<Button themeSize={'sm'}>Update</Button>} hasButton={['CANCEL']}>
        <ModalContentUpdate selectedRows={selectedRows} />
      </ModalWithBtn>
    </div>
  );
};

export default TcmSelect;
