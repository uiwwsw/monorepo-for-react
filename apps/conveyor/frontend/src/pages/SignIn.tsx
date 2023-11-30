import { useSignIn } from '!/auth/application/post-sign-in';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal, ToastWithPortal } from '@library-frontend/ui';
import { createLogger, wait } from '@package-frontend/utils';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SIGN_IN_QUERY_PARAM_TOAST, SIGN_IN_QUERY_PARAM_TOAST_KEY } from '!/routes/domain';

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
  const queryParamToastMsgs = {
    [SIGN_IN_QUERY_PARAM_TOAST['invalid-session']]: t('로그인 정보가 없어요. 로그인 완료 후 이전 페이지로 이동합니다.'),
    [SIGN_IN_QUERY_PARAM_TOAST['session-expired']]: t('세선만료'),
    [SIGN_IN_QUERY_PARAM_TOAST['success-update-password']]: t(
      '비밀번호가 변경됐어요. 변경된 비밀번호로 로그인해보세요.',
    ),
    [SIGN_IN_QUERY_PARAM_TOAST['success-sign-up']]: t('방금 가입한 아이디로 로그인 해보세요~'),
  };
  const {
    register,
    handleSubmit: handleAdapterSubmit,
    formState: { errors },
  } = useForm<FormState>();
  const { trigger, error, isMutating } = useSignIn();
  const [toast, setToast] = useState<string>();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const url = useMemo(() => new URLSearchParams(location.search), [location]);
  const urlFrom = useMemo(() => url.get('from'), [location]);
  const urlToast = useMemo(() => url.get('toast') as SIGN_IN_QUERY_PARAM_TOAST_KEY, [location]);
  const urlNextUrl = useMemo(() => (urlFrom?.startsWith('/sign') || !urlFrom ? '/control' : urlFrom), [location]);
  /* ======   function    ====== */
  const handleModalClose = async () => {
    await wait(500);
    navigate(urlNextUrl);
  };
  const handleSubmit = async (arg: FormState) => {
    await trigger(arg);
    setSuccess(true);
  };
  const handleGoSignUp = () => navigate('/sign-up');
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (urlToast) setToast(queryParamToastMsgs[urlToast]);
  }, [location]);
  logger('render');
  return (
    <>
      <ToastWithPortal open={!!toast}>{toast}</ToastWithPortal>
      <ModalWithPortal
        onClose={handleModalClose}
        open={success}
        smoothLoading
        hasButton={[urlFrom ? t('이전 페이지로 이동하기') : t('조작 페이지로 이동하기')]}
        persist
      >
        {t(`로그인이 완료됐어요.`)}
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
              autoComplete="id"
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
              autoComplete="pw"
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
        <Button smoothLoading themeColor={'secondary'} onClick={handleGoSignUp}>
          {t('회원가입 하러가기')}
        </Button>
      </PageCenter>
    </>
  );
};

export default SignIn;
