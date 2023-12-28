import { useServerReStart } from '!/control/application/post-server-restart';
import { useServerStart } from '!/control/application/post-server-start';
import { useServerStop } from '!/control/application/post-server-stop';
import useToastsForControl from '#/useToastsForControl';
import { Button } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ServerList } from '!/control/domain';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface ServerSelectProps {
  selectedRows?: Row<ServerList>[];
  isAllSelected?: boolean;
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/ServerSelect');
const ServerSelect = ({ selectedRows, isAllSelected }: ServerSelectProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { trigger: startTrigger, isMutating: startIsMutating } = useServerStart();
  const { trigger: stopTrigger, isMutating: stopIsMutating } = useServerStop();
  const { trigger: restartTrigger, isMutating: restartIsMutating } = useServerReStart();

  const selectedSids = useMemo(() => selectedRows?.map((row) => row.original.stateType) || [], [selectedRows]);
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: selectedSids });
  const disabled = useMemo(
    () => !selectedRows?.length || startIsMutating || stopIsMutating || restartIsMutating,
    [selectedRows, startIsMutating, stopIsMutating, restartIsMutating],
  );
  const chooseName = selectedSids.join(', ');
  const displayName = isAllSelected
    ? (order: string) => t('모든 서버로 {{order}} 명령어 전송', { order })
    : chooseName.length > 20
    ? (order: string) => t('{{length}}개의 서버로 {{order}} 명령어 전송', { order, length: selectedSids.length })
    : (order: string) => t('{{chooseName}} 서버로 {{order}} 명령어 전송', { order, chooseName });
  /* ======   function    ====== */

  const handleStartClick = () =>
    adapterEvent({
      startMsg: displayName('START'),
      duration: 2000,
      event(type) {
        return startTrigger(type);
      },
    });
  const handleStopClick = () =>
    adapterEvent({
      startMsg: displayName('STOP'),
      duration: 10000,
      event(type) {
        return stopTrigger(type);
      },
    });

  const handleRestartClick = () =>
    adapterEvent({
      startMsg: displayName('RESTART'),
      duration: 15000,
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
          {t('시작')}
        </Button>
        <Button disabled={disabled} themeColor="quaternary" smoothLoading onClick={handleStopClick}>
          {t('중지')}
        </Button>
        <Button disabled={disabled} smoothLoading onClick={handleRestartClick}>
          {t('재시작')}
        </Button>
      </div>
    </>
  );
};

export default ServerSelect;
