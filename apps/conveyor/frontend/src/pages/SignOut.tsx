import { useSignOut } from '!/auth/application/post-sign-out';
import { MAIN_QUERY_PARAM_TOAST } from '!/routes/domain';
import { createLogger, wait } from '@package-frontend/utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/SignOut');
const SignOut = () => {
  /* ======   variables   ====== */
  let count = 10;
  const navigate = useNavigate();
  const { trigger } = useSignOut();

  /* ======   function    ====== */
  const tryUntilSuccess = async (): Promise<boolean> => {
    logger('사인아웃 호출');
    try {
      const [res] = await Promise.all([trigger(), wait(100)]);
      logger('사인아웃 성공', 'e, count', res);
      return res;
    } catch (e) {
      logger('사인아웃 오류', e, count);
      if (--count) {
        const [res, _] = await Promise.all([tryUntilSuccess(), wait(100)]);
        return res;
      }
      return false;
    }
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect');
    (async () => {
      const res = await tryUntilSuccess();
      let query = '';
      if (res) query = new URLSearchParams({ toast: MAIN_QUERY_PARAM_TOAST['success-sign-out'] }).toString();
      else query = new URLSearchParams({ toast: MAIN_QUERY_PARAM_TOAST['failed-sign-out'] }).toString();
      navigate(`/?${query}`, { replace: true });
    })();
  }, []);
  return <iframe className="w-screen h-screen" src="/loading" />;
};

export default SignOut;
