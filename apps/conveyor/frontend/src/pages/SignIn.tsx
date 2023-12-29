import { useSignIn } from '!/auth/application/post-sign-in';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal, useCounter, useToasts } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SIGN_IN_QUERY_PARAM_TOAST, SIGN_IN_QUERY_PARAM_TOAST_KEY } from '!/routes/domain';
import WarningMessage from '@/Typography/WarningMessage';
import { useGetAuth } from '!/auth/application/get-auth';

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
    [SIGN_IN_QUERY_PARAM_TOAST['session-expired']]: t('세선이 만료됐습니다.'),
    [SIGN_IN_QUERY_PARAM_TOAST['success-update-password']]: t(
      '비밀번호가 변경됐어요. 변경된 비밀번호로 로그인해보세요.',
    ),
    [SIGN_IN_QUERY_PARAM_TOAST['success-sign-up']]: t('방금 가입한 아이디로 로그인 해보세요~'),
  };
  const { data: auth } = useGetAuth();
  const isLoggedIn = !!auth;
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
  } = useForm<FormState>();
  const { trigger, error, isMutating } = useSignIn();
  const { Toasts, showToast } = useToasts();
  const [success, setSuccess] = useState(false);
  const { onStart, decrease, done } = useCounter(3);
  const navigate = useNavigate();
  const location = useLocation();
  const url = useMemo(() => new URLSearchParams(location.search), [location]);
  const urlFrom = useMemo(() => url.get('from'), [location]);
  const urlToast = useMemo(() => url.get('toast') as SIGN_IN_QUERY_PARAM_TOAST_KEY, [location]);
  const urlNextUrl = useMemo(() => (urlFrom?.startsWith('/sign') || !urlFrom ? '/control' : urlFrom), [location]);

  const exPageBtn = t('이전 페이지로 이동하기');
  const controlPageBtn = t('조작 페이지로 이동하기');
  const closeBtn = t('닫기');
  /* ======   function    ====== */
  const handleGoPage = async (e?: typeof exPageBtn | typeof controlPageBtn | typeof closeBtn) => {
    setSuccess(false);
    if (e === '닫기') return;
    navigate(urlNextUrl);
    logger('handleGoPage');
  };
  const handleSubmit = async (arg: FormState) => {
    await trigger(arg);
    setSuccess(true);
    onStart();
    logger('handleSubmit', arg);
  };
  const handleGoSignUp = () => navigate('/sign-up');
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect');
    if (isLoggedIn)
      showToast({
        notClose: true,
        message: t('로그인 정보가 있습니다.'),
      });
    else if (urlToast)
      showToast({
        notClose: true,
        message: queryParamToastMsgs[urlToast],
      });
  }, [location]);
  useEffect(() => {
    if (!done) return;
    handleGoPage(success ? 'timeOut' : '닫기');
  }, [done]);
  return (
    <>
      {Toasts}
      <ModalWithPortal
        onClose={handleGoPage}
        open={success}
        smoothLoading
        persist
        hasButton={[urlFrom ? exPageBtn : controlPageBtn, closeBtn]}
      >
        <p className="whitespace-pre-line">
          {t('로그인이 완료됐어요.\n{{seconds}}초 뒤 자동으로 이동합니다.', { seconds: decrease })}
        </p>
      </ModalWithPortal>
      <PageCenter title={t('로그인')} icon="🗝️">
        <WarningMessage show={!isMutating}>{t(error?.message)}</WarningMessage>
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
            <WarningMessage>{errors?.id?.message}</WarningMessage>
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
            <WarningMessage>{errors?.pw?.message}</WarningMessage>
          </label>
          <Button smoothLoading onClick={formSubmit(handleSubmit)}>
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
