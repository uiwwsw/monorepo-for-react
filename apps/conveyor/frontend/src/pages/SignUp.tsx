import { useSignUp } from '!/auth/application/post-sign-up';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SIGN_IN_QUERY_PARAM_TOAST } from '!/routes/domain';
import WarningMessage from '@/Typography/WarningMessage';

/* ======   interface   ====== */
interface FormState {
  id: string;
  name: string;
  pw: string;
  rpw: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/SignUp');
const SignUp = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const {
    register,
    handleSubmit: handleAdapterSubmit,
    formState: { errors },
    watch,
  } = useForm<FormState>();
  const { trigger, error, isMutating } = useSignUp();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  /* ======   function    ====== */
  const handleSubmit = async (arg: FormState) => {
    await trigger(arg);
    setSuccess(true);
    logger('handleSubmit', arg);
  };
  const handleModalClose = () => navigate(`/sign-in?toast=${SIGN_IN_QUERY_PARAM_TOAST['success-sign-up']}`);
  /* ======   useEffect   ====== */

  return (
    <>
      <ModalWithPortal onClose={handleModalClose} open={success} hasButton={[t('로그인 페이지로 이동')]} persist>
        <p className="whitespace-pre-line">{t('회원가입이 완료됐어요.')}</p>
      </ModalWithPortal>
      <PageCenter title={t('회원가입')} icon="🔐">
        {!isMutating && <WarningMessage>{t(error?.message)}</WarningMessage>}

        <form className="flex flex-col gap-3">
          <label>
            <p className="font-medium uppercase">{t('이름')}</p>
            <Input
              {...register('name', {
                required: t('이름을 입력해주세요.'),
              })}
              autoComplete="name"
              placeholder={t('이름을 입력해주세요.')}
              error={!!errors?.name?.message}
              className="w-full"
            />
            <WarningMessage>{errors?.name?.message}</WarningMessage>
          </label>
          <label>
            <p className="font-medium uppercase">{t('아이디')}</p>
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
            <p className="font-medium uppercase">{t('비밀번호')}</p>
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
          <label>
            <p className="font-medium uppercase">{t('비밀번호 확인')}</p>
            <Input
              {...register('rpw', {
                required: t('동일한 비밀번호를 한번 더 입력해주세요.'),
                validate: (val: string) => {
                  if (watch('pw') != val) {
                    return t('비밀번호가 일치하지 않아요.');
                  }
                },
              })}
              autoComplete="rpw"
              placeholder={t('동일한 비밀번호를 한번 더 입력해주세요.')}
              error={!!errors?.rpw?.message}
              type="password"
              className="w-full"
            />
            <WarningMessage>{errors?.rpw?.message}</WarningMessage>
          </label>
          <Button smoothLoading onClick={handleAdapterSubmit(handleSubmit)}>
            {t('회원가입')}
          </Button>
        </form>
      </PageCenter>
    </>
  );
};

export default SignUp;
