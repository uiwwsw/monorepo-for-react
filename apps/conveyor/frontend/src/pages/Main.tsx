import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { ToastWithPortal, Tutorial } from '@library-frontend/ui';
import { useState } from 'react';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');

const Main = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const toastMsg = '토스트 팝업입니다.\\n유저의 이벤트에 피드백을 주어 서비스를 이해하는데 도움이 됩니다.';
  const toastTutorial = LocalStorage.get(`tutorial-"${toastMsg.toString()}"`);
  const [toast, setToast] = useState(!toastTutorial);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render', `tutorial-"${toastMsg}"`);
  return (
    <>
      <span className="absolute right-5 bottom-5">
        <ToastWithPortal notClosed open={toast} onClose={() => setToast(false)}>
          텍스트 영역
        </ToastWithPortal>
      </span>

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
