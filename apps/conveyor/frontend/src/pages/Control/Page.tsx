import { useTcmInfo } from '!/control/application/get-tcm-info';
import { createLogger } from '@package-frontend/utils';
import Table from '@/Table';
import { useServerInfo } from '!/control/application/get-server-info';
import TcmSub from './TcmSub';
import TcmSelect from './TcmSelect';
import ServerSelect from './ServerSelect';
import ServerSub from './ServerSub';
import { useMemo } from 'react';
import { Button } from '@library-frontend/ui';
import { useResume } from '!/control/application/post-resume';
import { usePause } from '!/control/application/post-pause';
import H2 from '@/Typography/H2';
import useToastsForControl from '#/useToastsForControl';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmData } = useTcmInfo();
  const { data: serverData } = useServerInfo();
  const { trigger: resumeTrigger, isMutating: resumeIsMutating } = useResume();
  const { trigger: pauseTrigger, isMutating: pauseIsMutating } = usePause();
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: [0] });
  const disabled = useMemo(() => resumeIsMutating || pauseIsMutating, [resumeIsMutating, pauseIsMutating]);

  /* ======   function    ====== */
  const handleResumeClick = () =>
    adapterEvent({
      startMsg: '컨베이어 시스템 RESUME 중입니다.',
      successMsg: '컨베이어 시스템 RESUME 완료',
      failMsg(fails) {
        return '컨베이어 시스템 RESUME 실패:' + fails[0].message;
      },
      event() {
        return resumeTrigger();
      },
    });
  const handlePauseClick = () =>
    adapterEvent({
      startMsg: '컨베이어 시스템 PAUSE 중입니다.',
      successMsg: '컨베이어 시스템 PAUSE 완료',
      failMsg(fails) {
        return '컨베이어 시스템 PAUSE 실패:' + fails[0].message;
      },
      event() {
        return pauseTrigger();
      },
    });

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      {Toasts}
      <div className="flex gap-5 flex-col">
        <div className="flex ml-auto gap-2">
          <Button disabled={disabled} smoothLoading themeSize="xl" themeColor="secondary" onClick={handleResumeClick}>
            Resume
          </Button>
          <Button disabled={disabled} smoothLoading themeSize="xl" themeColor="quaternary" onClick={handlePauseClick}>
            Pause
          </Button>
        </div>
        <div>
          <H2>TCM Control</H2>
          <Table
            thead={['tid', 'status', 'version', 'adjTcmConnection', 'Process']}
            data={tcmData}
            makePagination={false}
            renderSelectComponent={<TcmSelect />}
            renderSubComponent={<TcmSub />}
          ></Table>
        </div>
        <div>
          <H2>Server Control</H2>
          <Table
            thead={['sid', 'type', 'status', 'version']}
            data={serverData}
            makePagination={false}
            renderSelectComponent={<ServerSelect />}
            renderSubComponent={<ServerSub />}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default Control;
