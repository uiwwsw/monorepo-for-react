import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { createLogger } from '@package-frontend/utils';
import { ToastWithPortal, Tutorial, tutorialStorage } from '@library-frontend/ui';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MAIN_QUERY_PARAM_TOAST } from '!/routes/domain';
// import useSocket from '#/useSocket';
// import { SocketSubscript } from '!/socket/domain';
// import { CTRL_SOCKET_NAME } from '!/control/domain';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const tutorialToastMsg = '토스트 팝업입니다.\n유저의 이벤트에 피드백을 주어 서비스를 이해하는데 도움이 됩니다.';

const Main = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const queryParamToastMsgs = {
    [MAIN_QUERY_PARAM_TOAST['success-sign-out']]: t('로그아웃 성공했습니다.'),
    [MAIN_QUERY_PARAM_TOAST['failed-sign-out']]: t('로그아웃에 실패했습니다.'),
  };
  const [toast, setToast] = useState<string>();
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

  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect');
    if (urlToast) setToast(queryParamToastMsgs[urlToast]);
  }, [location]);
  return (
    <>
      <ToastWithPortal notClose open={!toastTutorial}>
        {
          //튜토리얼용 토스트
        }
        텍스트 영역
      </ToastWithPortal>
      <ToastWithPortal open={!!toast}>{toast}</ToastWithPortal>

      <Tutorial
        guide={[
          {
            text: tutorialToastMsg,

            position: {
              bottom: '30px',
              right: '40px',
            },
            size: {
              width: '130px',
              height: '45px',
            },
          },
        ]}
      />
      <PageCenter icon="🖥️" title={t('컨베이어 for YMTC')}>
        {t('컨베이어 웹 서비스에 오신걸 환영합니다.')}
      </PageCenter>
    </>
  );
};

export default Main;
