import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { ToastWithPortal, Tutorial } from '@library-frontend/ui';
import { useState } from 'react';
// import useSocket from '#/useSocket';
// import { SocketSubscript } from '!/socket/domain';
// import { CTRL_SOCKET_NAME } from '!/control/domain';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');

const Main = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const toastMsg = '토스트 팝업입니다.\n유저의 이벤트에 피드백을 주어 서비스를 이해하는데 도움이 됩니다.';
  const toastTutorial = LocalStorage.get(`tutorial-"${toastMsg.replace(/\n/g, '\\n')}"`);
  const [toast, setToast] = useState(!toastTutorial);
  // useSocket<CTRL_SOCKET_NAME>(
  //   new SocketSubscript('tcmUpdate', (d) => {
  //     return d;
  //   }),
  // );
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <ToastWithPortal notClosed open={toast} onClose={() => setToast(false)}>
        텍스트 영역
      </ToastWithPortal>

      <Tutorial
        guide={[
          {
            text: toastMsg,

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
      <PageCenter icon="🧑🏻‍💻" title={t('컨베이어 for YMTC')}>
        {t('컨베이어 웹 서비스에 오신걸 환영합니다.')}
      </PageCenter>
    </>
  );
};

export default Main;
