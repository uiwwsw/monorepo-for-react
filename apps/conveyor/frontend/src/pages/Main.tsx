import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { createLogger } from '@package-frontend/utils';
import { Emoji, ToastWithPortal, Tutorial, tutorialStorage, useToasts } from '@library-frontend/ui';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MAIN_QUERY_PARAM_TOAST } from '!/routes/domain';
import H3 from '@/Typography/H3';
// import useSocket from '#/useSocket';
// import { SocketSubscript } from '!/socket/domain';
// import { CTRL_SOCKET_NAME } from '!/control/domain';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');

const Main = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const tutorialToastMsg = t('토스트 팝업입니다.\n유저의 이벤트에 피드백을 주어 서비스를 이해하는데 도움이 됩니다.');
  const { Toasts, showToast } = useToasts();
  const location = useLocation();
  const url = useMemo(() => new URLSearchParams(location.search), [location]);
  const urlToast = useMemo(() => url.get('toast') as MAIN_QUERY_PARAM_TOAST, [location]);

  const toastTutorial = tutorialStorage.get(`tutorial-"${tutorialToastMsg.replace(/\n/g, '\\n')}"`);
  // useSocket<CTRL_SOCKET_NAME>(
  //   new SocketSubscript('tcmUpdate', (d) => {
  //     return d;
  //   }),
  // );
  /* ======   function    ====== */
  const handleHide = () => setTutorialVisible(false);

  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect');
    if (urlToast) {
      switch (urlToast) {
        case MAIN_QUERY_PARAM_TOAST['success-sign-out']:
          showToast({
            message: t('로그아웃 성공했습니다.'),
            type: 'success',
          });
          break;

        case MAIN_QUERY_PARAM_TOAST['failed-sign-out']:
          showToast({
            message: t('로그아웃에 실패했습니다.'),
            type: 'fail',
          });
          break;
      }
    }
  }, [location]);
  return (
    <>
      {Toasts}

      <>
        <ToastWithPortal type="success" notClose open={!toastTutorial && tutorialVisible}>
          {
            //튜토리얼용 토스트
          }
          이벤트 성공
        </ToastWithPortal>
        <ToastWithPortal type="fail" notClose open={!toastTutorial && tutorialVisible}>
          {
            //튜토리얼용 토스트
          }
          이벤트 실패
        </ToastWithPortal>
        <ToastWithPortal notClose open={!toastTutorial && tutorialVisible}>
          {
            //튜토리얼용 토스트
          }
          정보성 메세지
        </ToastWithPortal>
        <ToastWithPortal notClose open={!toastTutorial && tutorialVisible}>
          {
            //튜토리얼용 토스트
          }
          <Emoji>🔔</Emoji>시스템 메시지
        </ToastWithPortal>
      </>
      <Tutorial
        onFinish={handleHide}
        guide={[
          {
            text: tutorialToastMsg,

            position: {
              bottom: '20px',
              right: '30px',
            },
            size: {
              width: '190px',
              height: '250px',
            },
          },
        ]}
      />
      <PageCenter icon="🖥️" title={t('컨베이어 for YMTC')}>
        <img src="/conveyor.png" alt="conveyor" />
        <div className="flex items-end justify-end">
          <span className="text-2xl font-bold">v</span>
          <H3>{import.meta.env.PACKAGE_VERSION}</H3>
        </div>
      </PageCenter>
    </>
  );
};

export default Main;
