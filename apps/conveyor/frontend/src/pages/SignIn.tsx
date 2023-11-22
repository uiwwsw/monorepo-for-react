import { useSignIn } from '!/auth/application/post-sign-in';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

/* ======   interface   ====== */
interface FormState {
  id: string;
  pw: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/SignIn');
const SignIn = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const {
    register,
    handleSubmit: handleAdapterSubmit,
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
    navigate(from === '/sign-up' || !from ? '/control' : from);
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
    <>
      <ToastWithPortal open={true} duration={Infinity}>
        현재는 목업 로그인만 가능합니다.
        <br />
        id: johndoe, pw: MySecurePassword123! 로 로그인 후 사용해보세요.
      </ToastWithPortal>
      <ToastWithPortal open={lostAuthToast} duration={Infinity}>
        {t('로그아웃에 성공했습니다.')}
      </ToastWithPortal>
      <ToastWithPortal open={signUpAfterToast}>{t('방금 가입한 아이디로 로그인 해보세요~')}</ToastWithPortal>
      <ModalWithPortal onClose={fakeWait} open={success} hasButton={[t('확인')]} persist>
        {t(`로그인이 완료됐어요.\n확인을 누르면 메인 혹은 이전에 접근한 페이지로 이동합니다.`)}
      </ModalWithPortal>
      <PageCenter title={t('로그인')} icon="🗝️">
        {!isMutating && error?.message && <p className="text-red-500">💥 {error?.message}</p>}

        <form className="flex flex-col gap-3">
          <label>
            <p className="font-medium">{t('아이디')}</p>
            <Input
              {...register('id', {
                required: t('아이디를 입력해주세요.'),
              })}
              placeholder={t('아이디를 입력해주세요.')}
              error={!!errors?.id?.message}
              className="w-full"
            />
            {errors?.id?.message && <p className="text-red-500">💥 {errors?.id?.message}</p>}
          </label>
          <label>
            <p className="font-medium">{t('비밀번호')}</p>
            <Input
              {...register('pw', {
                required: t('비밀번호를 입력해주세요.'),
              })}
              placeholder={t('비밀번호를 입력해주세요.')}
              error={!!errors?.pw?.message}
              type="password"
              className="w-full"
            />
            {errors?.pw?.message && <p className="text-red-500">💥 {errors?.pw?.message}</p>}
          </label>
          <Button smoothLoading onClick={handleAdapterSubmit(handleSubmit)}>
            {t('로그인')}
          </Button>
        </form>
        <Button smoothLoading themeColor={'secondary'} onClick={handleGoSignup}>
          {t('회원가입 하러가기')}
        </Button>
      </PageCenter>
    </>
  );
};

export default SignIn;
