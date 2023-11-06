import { useSignIn } from '!/auth/application/sign-in';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/SignIn');
const SignIn = () => {
  /* ======   variables   ====== */
  const { trigger } = useSignIn();
  const [toast, setToast] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  /* ======   function    ====== */
  const fakeWait = async () => {
    await new Promise((res) => setTimeout(res, 5000));
    navigate('/');
  };
  const handleSubmit = async () => {
    await trigger({ id: 'abc', pw: 'def' });
    setSuccess(true);
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    const url = new URLSearchParams(location.search);
    if (url.get('from')) setToast(true);
  }, [location]);
  logger('render');
  return (
    <PageCenter title="로그인" icon="🗝️">
      <ToastWithPortal open={toast}>방금 가입한 아이디로 로그인 해보세요~</ToastWithPortal>
      <ModalWithPortal onClose={fakeWait} open={success} hasButton={['OK']} persist>
        로그인이 완료됐어요.
      </ModalWithPortal>
      <div className="flex flex-col gap-3 w-64">
        <label>
          <p className="font-medium">아이디</p>
          <Input className="w-full" />
        </label>
        <label>
          <p className="font-medium">비밀번호</p>
          <Input className="w-full" />
        </label>
        <Button smoothLoading onClick={handleSubmit}>
          로그인
        </Button>
      </div>
    </PageCenter>
  );
};

export default SignIn;
