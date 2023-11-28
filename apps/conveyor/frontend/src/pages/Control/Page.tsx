import { useTcmInfo } from '!/control/application/get-tcm-info';
import { createLogger } from '@package-frontend/utils';
import Table from '@/Table';
import { useServerInfo } from '!/control/application/get-server-info';
import TcmSub from './TcmSub';
import TcmSelect from './TcmSelect';
import ServerSelect from './ServerSelect';
import ServerSub from './ServerSub';
import { useState } from 'react';
import { Button, ToastWithPortal } from '@library-frontend/ui';
import { ResponseResult } from '!/control/domain';
import { useResume } from '!/control/application/post-resume';
import { usePause } from '!/control/application/post-pause';
import H2 from '@/Typography/H2';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmData } = useTcmInfo();
  const { data: serverData } = useServerInfo();
  const { trigger: resumeTrigger } = useResume();
  const { trigger: pauseTrigger } = usePause();
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  /* ======   function    ====== */
  const showToast = (msg: string) => setToastMessages((prev) => [...prev, msg]);
  const handleResumeClick = async () => {
    showToast('컨베이어 시스템 RESUME 중입니다.');

    try {
      const status = await resumeTrigger();
      if (status?.result === ResponseResult.SUCCESS) {
        showToast(`컨베이어 시스템 RESUME 완료`);
      } else {
        showToast(`컨베이어 시스템 RESUME 실패, ${status?.reason}`);
      }
    } catch (error) {
      showToast(`${error}`);
    }
  };

  const handlePauseClick = async () => {
    showToast('컨베이어 시스템 PAUSE 중입니다.');

    try {
      const status = await pauseTrigger();
      if (status?.result === ResponseResult.SUCCESS) {
        showToast(`컨베이어 시스템 PAUSE 완료`);
      } else {
        showToast(`컨베이어 시스템 PAUSE 실패, ${status?.reason}`);
      }
    } catch (error) {
      showToast(`${error}`);
    }
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      {toastMessages.map((x) => (
        <ToastWithPortal open>{x}</ToastWithPortal>
      ))}
      <div className="flex gap-5 flex-col">
        <div className="flex ml-auto gap-2">
          <Button themeSize="sm" themeColor="secondary" onClick={handleResumeClick}>
            Resume
          </Button>
          <Button themeSize="sm" themeColor="secondary" onClick={handlePauseClick}>
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
