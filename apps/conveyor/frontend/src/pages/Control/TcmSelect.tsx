import { Button } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
import ControlModalUpdate from './Modals/Update';
import { useTcmStart } from '!/control/application/post-tcm-start';
import { useTcmStop } from '!/control/application/post-tcm-stop';
import { useTcmReStart } from '!/control/application/post-tcm-restart';
import { useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import useToastsForControl from '#/useToastsForControl';
import { TcmList } from '!/control/domain';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface ControlTcmSelectProps {
  selectedRows?: Row<TcmList>[];
  isAllSelected?: boolean;
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/ControlTcmSelect');
const ControlTcmSelect = ({ selectedRows, isAllSelected }: ControlTcmSelectProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

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
  const disabledForUpdate = useMemo(
    () => disabled || !selectedRows?.every((x) => x.original.status === 'OFFLINE'),
    [disabled, selectedRows],
  );
  const chooseName = selectedTids.join(', ');
  /* ======   function    ====== */
  const displayName = isAllSelected
    ? (order: string) => t('모든 TCM으로 {{order}} 명령어 전송', { order })
    : chooseName.length > 20
    ? (order: string) => t('{{length}}개의 TCM로 {{order}} 명령어 전송', { order, length: selectedTids.length })
    : (order: string) => t('TCM {{chooseName}}로 {{order}} 명령어 전송', { order, chooseName });
  const handleStartClick = () =>
    adapterEvent({
      startMsg: displayName('START'),
      duration: 3000,
      event(TCM_ID) {
        return startTrigger({ TCM_ID });
      },
    });
  const handleStopClick = () =>
    adapterEvent({
      startMsg: displayName('STOP'),
      duration: 10000,
      event(TCM_ID) {
        return stopTrigger({ TCM_ID });
      },
    });
  const handleRestartClick = () =>
    adapterEvent({
      startMsg: displayName('RESTART'),
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
          {t('시작')}
        </Button>
        <Button disabled={disabled} themeColor="quaternary" smoothLoading onClick={handleStopClick}>
          {t('중지')}
        </Button>
        <Button disabled={disabled} smoothLoading onClick={handleRestartClick}>
          {t('재시작')}
        </Button>
        <ControlModalUpdate disabled={disabledForUpdate} selectedRows={selectedTids} selectedAdds={selectedAdds} />
      </div>
    </>
  );
};

export default ControlTcmSelect;
