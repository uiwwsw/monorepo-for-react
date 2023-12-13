import { Button } from '@library-frontend/ui';
// import { createLogger } from '@package-frontend/utils';
import ModalUpdate from './Modals/Update';
import { useTcmStart } from '!/control/application/post-tcm-start';
import { useTcmStop } from '!/control/application/post-tcm-stop';
import { useTcmReStart } from '!/control/application/post-tcm-restart';
import { useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import useToastsForControl from '#/useToastsForControl';
import { TcmList } from '!/control/domain';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface TcmSelectProps {
  selectedRows?: Row<TcmList>[];
  isAllSelected?: boolean;
}
/* ======    global     ====== */
// const logger = createLogger('pages/Control/TcmSelect');
const TcmSelect = ({ selectedRows, isAllSelected }: TcmSelectProps) => {
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
  const chooseName = selectedTids.join(', ');
  const displayName = isAllSelected
    ? (order: string) => t('모든 TCM으로 {{order}} 명령어 전달중입니다.', { order })
    : chooseName.length > 20
    ? (order: string) =>
        t('{{length}}개의 TCM으로 {{order}} 명령어 전달중입니다.', { order, length: selectedTids.length })
    : (order: string) => t('{{chooseName}} TCM으로 {{order}} 명령어 전달중입니다.', { order, chooseName });
  /* ======   function    ====== */
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
          Start
        </Button>
        <Button disabled={disabled} themeColor="quaternary" smoothLoading onClick={handleStopClick}>
          Stop
        </Button>
        <Button disabled={disabled} smoothLoading onClick={handleRestartClick}>
          Restart
        </Button>
        <ModalUpdate disabled={disabled} selectedRows={selectedTids} selectedAdds={selectedAdds} />
      </div>
    </>
  );
};

export default TcmSelect;
