// import { useTcmInfo } from '!/control/application/get-tcm-info';
import Table from '@/Table';
// import { useServerInfo } from '!/control/application/get-server-info';
import TcmSub from './TcmSub';
import TcmSelect from './TcmSelect';
import ServerSelect from './ServerSelect';
import ServerSub from './ServerSub';
import { Loading } from '@library-frontend/ui';
import H2 from '@/Typography/H2';
import { WS_STATUS, useSocketDataContext } from '@/SocketDataContext';
import useSetting from '#/useSetting';
// import { useDataContext } from '@/DataContext';
// import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
/* ======    global     ====== */

// const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { tcmList, serverList, status } = useSocketDataContext();
  const { controlPagination } = useSetting();
  // if (status !== WS_STATUS.OPEN) return <Loading show />;
  // const { data: tcmData } = useTcmInfo();
  // const { data: serverData } = useServerInfo();
  // const { trigger: resumeTrigger, isMutating: resumeIsMutating } = useResume();
  // const { trigger: pauseTrigger, isMutating: pauseIsMutating } = usePause();
  // const disabled = useMemo(() => resumeIsMutating || pauseIsMutating, [resumeIsMutating, pauseIsMutating]);

  /* ======   function    ====== */
  // const handleResumeClick = () =>
  //   adapterEvent({
  //     startMsg: t('컨베이어 시스템 RESUME 중입니다.'),
  //     successMsg: t('컨베이어 시스템 RESUME 완료'),
  //     failMsg(fails) {
  //       return '컨베이어 시스템 RESUME 실패:' + fails[0].message;
  //     },
  //     event() {
  //       return resumeTrigger();
  //     },
  //   });
  // const handlePauseClick = () =>
  //   adapterEvent({
  //     startMsg: t('컨베이어 시스템 PAUSE 중입니다.'),
  //     successMsg: t('컨베이어 시스템 PAUSE 완료'),
  //     failMsg(fails) {
  //       return '컨베이어 시스템 PAUSE 실패:' + fails[0].message;
  //     },
  //     event() {
  //       return pauseTrigger();
  //     },
  //   });

  /* ======   useEffect   ====== */
  return (
    <>
      <Loading show={status !== WS_STATUS.OPEN} />
      <div className="flex gap-5 flex-col">
        {/* <div className="flex ml-auto gap-2">
          <Button disabled={disabled} smoothLoading themeSize="xl" themeColor="secondary" onClick={handleResumeClick}>
            <Test className="left-0 top-0">Resume</Test>
          </Button>
          <Button disabled={disabled} smoothLoading themeSize="xl" themeColor="quaternary" onClick={handlePauseClick}>
            <Test className="left-0 top-0">Pause</Test>
          </Button>
        </div> */}
        {/* <div>
          <H2>Communication Control</H2>
          <Table
            thead={['type', 'commState', 'controlState', 'processingState']}
            data={communicationList}
            makePagination={false}
          ></Table>
        </div> */}
        <div>
          <H2>Server Control</H2>
          <Table
            fixHead={{ status: 'alive' }}
            thead={['status', 'stateType']}
            data={serverList}
            makePagination={controlPagination}
            renderSelectComponent={<ServerSelect />}
            renderSubComponent={<ServerSub />}
          ></Table>
        </div>

        <div>
          <H2>TCM Control</H2>
          <Table
            fixHead={{ status: 'alive' }}
            thead={['status', 'tcmId', 'buildDate', 'buildNum', 'ipAddress']}
            data={tcmList}
            makePagination={controlPagination}
            renderSelectComponent={<TcmSelect />}
            renderSubComponent={<TcmSub />}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default Control;
