import { useTcmInfo } from '!/control/application/get-tcm-info';
import { createLogger } from '@package-frontend/utils';
import Table from '@/Table';
import { useServerInfo } from '!/control/application/get-server-info';
import TcmSub from './TcmSub';
import TcmSelect from './TcmSelect';
import ServerSelect from './ServerSelect';
import ServerSub from './ServerSub';
import { useState } from 'react';
import { Button, ToastWithBtn } from '@library-frontend/ui';
import { ResponseResult } from '!/control/domain';
import { useResume } from '!/control/application/post-resume';
import { usePause } from '!/control/application/post-pause';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmData } = useTcmInfo();
  const { data: serverData } = useServerInfo();
  const { trigger: resumeTrigger } = useResume();
  const { trigger: pauseTrigger } = usePause();
  const [toastMessageResume, setToastMessageResume] = useState('');
  const [toastMessagePause, setToastMessagePause] = useState('');

  /* ======   function    ====== */
  const handleResumeClick = async () => {
    setToastMessageResume('컨베이어 시스템 RESUME 중입니다.');

    try {
      const status = await resumeTrigger();
      if (status?.result === ResponseResult.SUCCESS) {
        setToastMessageResume(`컨베이어 시스템 RESUME 완료`);
      } else {
        setToastMessageResume(`컨베이어 시스템 RESUME 실패, ${status?.reason}`);
      }
    } catch (error) {
      setToastMessageResume(`${error}`);
    }
  };

  const handlePauseClick = async () => {
    setToastMessagePause('컨베이어 시스템 PAUSE 중입니다.');

    try {
      const status = await pauseTrigger();
      if (status?.result === ResponseResult.SUCCESS) {
        setToastMessagePause(`컨베이어 시스템 PAUSE 완료`);
      } else {
        setToastMessagePause(`컨베이어 시스템 PAUSE 실패, ${status?.reason}`);
      }
    } catch (error) {
      setToastMessagePause(`${error}`);
    }
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">TCM Control</h2>
          <div className="flex space-x-2">
            <ToastWithBtn
              button={
                <Button themeSize="sm" themeColor="secondary" onClick={handleResumeClick}>
                  Resume
                </Button>
              }
              duration={Infinity}
            >
              {toastMessageResume}
            </ToastWithBtn>
            <ToastWithBtn
              button={
                <Button themeSize="sm" themeColor="secondary" onClick={handlePauseClick}>
                  Pause
                </Button>
              }
              duration={Infinity}
            >
              {toastMessagePause}
            </ToastWithBtn>
          </div>
        </div>

        <Table
          thead={['tid', 'status', 'version', 'adjTcmConnection', 'Process']}
          data={tcmData}
          makePagination={false}
          makeColumnSelect={false}
          renderSelectComponent={<TcmSelect />}
          renderSubComponent={<TcmSub />}
        ></Table>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Server Control</h2>
        <Table
          thead={['sid', 'type', 'status', 'version']}
          data={serverData}
          makePagination={false}
          makeColumnSelect={false}
          renderSelectComponent={<ServerSelect />}
          renderSubComponent={<ServerSub />}
        ></Table>
      </div>
    </>
  );
};

export default Control;
