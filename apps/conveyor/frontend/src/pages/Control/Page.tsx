// import { useTcmInfo } from '!/control/application/get-tcm-info';
import Table from '@/Table';
// import { useServerInfo } from '!/control/application/get-server-info';
import ControlTcmSub from './TcmSub';
import ControlTcmSelect from './TcmSelect';
import ControlServerSelect from './ServerSelect';
import ControlServerSub from './ServerSub';
import { Loading } from '@library-frontend/ui';
import H2 from '@/Typography/H2';
import { WS_STATUS, useSocketDataContext } from '@/SocketDataContext';
import useSetting from '#/useSetting';
import { useTranslation } from 'react-i18next';
import { ServerList, TcmList } from '!/control/domain';
import H1 from '@/Typography/H1';
// import { useDataContext } from '@/DataContext';
// import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
type TcmHead = keyof TcmList;
type ServerThead = keyof ServerList;

/* ======    global     ====== */

// const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  //   TcmList
  // ServerList
  const tcmThead: TcmHead[] = ['status', 'tcmId', 'buildDate', 'buildNum', 'ipAddress'];
  const serverThead: ServerThead[] = ['status', 'stateType'];
  const serverFixHead: Partial<Record<ServerThead, string>> = {
    status: t('얼라이브'),
    stateType: t('서버 타입'),
  };
  const tcmFixHead: Partial<Record<TcmHead, string>> = {
    tcmId: t('TCM 아이디'),
    status: t('얼라이브'),
    buildDate: t('빌드 데이트'),
    buildNum: t('빌드넘버'),
    ipAddress: t('아이피'),
  };
  const { pageSizeForTcm } = useSetting();

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
  // useEffect(() => {
  //   addGuides([{ text: 'dawd' }]);
  // }, []);
  return (
    <>
      <Loading show={status !== WS_STATUS.OPEN} />
      <div className="flex gap-5 flex-col">
        <H1>{t('조작')}</H1>

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
          <H2>{t('서버 조작')}</H2>
          <Table
            thead={serverThead}
            fixHead={serverFixHead}
            data={serverList}
            renderSelectComponent={<ControlServerSelect />}
            renderSubComponent={<ControlServerSub />}
          ></Table>
        </div>

        <div>
          <H2>{t('TCM 조작')}</H2>
          <Table
            thead={tcmThead}
            fixHead={tcmFixHead}
            data={tcmList}
            pageSize={pageSizeForTcm}
            makePagination={controlPagination}
            renderSelectComponent={<ControlTcmSelect />}
            renderSubComponent={<ControlTcmSub />}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default Control;
