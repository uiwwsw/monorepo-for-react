import { useSignIn } from '!/auth/application/sign-in';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal, ToastWithPortal } from '@library-frontend/ui';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

/* ======   interface   ====== */
interface FormState {
  id: string;
  pw: string;
  rpw: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/SignIn');
const SignIn = () => {
  /* ======   variables   ====== */
  const {
    register,
    handleSubmit: useFormSumit,
    formState: { errors },
  } = useForm<FormState>();
  const { trigger, error, isMutating } = useSignIn();
  const [lostAuthToast, setLostAuthToast] = useState(false);
  const [signUpAfterToast, setSignupAfterToast] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const url = useMemo(() => new URLSearchParams(location.search), [location]);
  const from = useMemo(() => url.get('from'), [location]);
  /* ======   function    ====== */
  const fakeWait = () => {
    navigate(from === '/sign-up' || !from ? '/' : from);
  };
  const handleSubmit = async (arg: FormState) => {
    await trigger(arg);
    setSuccess(true);
  };
  const handleGoSignup = () => navigate('/sign-up');
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (url.get('from') === '/sign-up') setSignupAfterToast(true);
    if (url.get('sign-out') === 'true') setLostAuthToast(true);
  }, [location]);
  logger('render');
  return (
    <PageCenter title="로그인" icon="🗝️">
      {!isMutating && error?.message && <p className="text-red-500">💥 {error?.message}</p>}
      <ToastWithPortal open={lostAuthToast} duration={Infinity}>
        로그아웃에 성공했습니다.
      </ToastWithPortal>
      <ToastWithPortal open={signUpAfterToast}>방금 가입한 아이디로 로그인 해보세요~</ToastWithPortal>
      <ModalWithPortal onClose={fakeWait} open={success} hasButton={['OK']} persist>
        로그인이 완료됐어요.
      </ModalWithPortal>
      <div className="flex flex-col gap-3 min-w-[500px]">
        <label>
          <p className="font-medium">아이디</p>
          <Input
            {...register('id', {
              required: '아이디를 입력해주세요.',
            })}
            error={!!errors?.id?.message}
            className="w-full"
          />
          {errors?.id?.message && <p className="text-red-500">💥 {errors?.id?.message}</p>}
        </label>
        <label>
          <p className="font-medium">비밀번호</p>
          <Input
            {...register('pw', {
              required: '비밀번호를 입력해주세요.',
            })}
            error={!!errors?.pw?.message}
            type="password"
            className="w-full"
          />
          {errors?.pw?.message && <p className="text-red-500">💥 {errors?.pw?.message}</p>}
        </label>
        <Button smoothLoading onClick={useFormSumit(handleSubmit)}>
          로그인
        </Button>
      </div>
      <Button smoothLoading themeColor={'secondary'} onClick={handleGoSignup}>
        회원가입 하러가기
      </Button>
    </PageCenter>
  );
};

export default SignIn;
