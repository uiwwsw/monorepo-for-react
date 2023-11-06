import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/SignUp');
const SignUp = () => {
  /* ======   variables   ====== */
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  /* ======   function    ====== */
  const fakeWait = async () => {
    await new Promise((res) => setTimeout(res, 5000));
    navigate('/sign-in?from=sign-up');
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <PageCenter title="회원가입" icon="🔓">
      <ModalWithPortal onClose={fakeWait} open={success} hasButton={['OK']} persist>
        회원가입이 완료됐어요.
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
        <label>
          <p className="font-medium">비밀번호 확인</p>
          <Input className="w-full" />
        </label>
        <Button smoothLoading onClick={() => setSuccess(true)}>
          회원가입
        </Button>
      </div>
    </PageCenter>
  );
};

export default SignUp;
