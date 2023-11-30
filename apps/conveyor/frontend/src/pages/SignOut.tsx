import { useSignOut } from '!/auth/application/post-sign-out';
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
  const tryUntilSuccess = async () => {
    logger('사인아웃 호출');
    try {
      await trigger();
    } catch (e) {
      logger('사인아웃 오류', e, count);
      if (--count) await Promise.all([tryUntilSuccess(), wait(100)]);
    }
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    (async () => {
      await tryUntilSuccess();
      navigate('/', { replace: true });
    })();
  }, []);
  return <iframe className="w-screen h-screen" src="/loading" />;
};

export default SignOut;
