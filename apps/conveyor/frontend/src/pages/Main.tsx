import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { createLogger } from '@package-frontend/utils';
import { useToasts } from '@library-frontend/ui';
import { useEffect, useMemo } from 'react';
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
  const { Toasts, showToast } = useToasts();
  const location = useLocation();
  const url = useMemo(() => new URLSearchParams(location.search), [location]);
  const urlToast = useMemo(() => url.get('toast') as MAIN_QUERY_PARAM_TOAST, [location]);

  // useSocket<CTRL_SOCKET_NAME>(
  //   new SocketSubscript('tcmUpdate', (d) => {
  //     return d;
  //   }),
  // );
  /* ======   function    ====== */
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
