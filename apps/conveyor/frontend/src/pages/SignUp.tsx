import { useSignUp } from '!/auth/application/post-sign-up';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
  };
  const handleModalClose = () => navigate('/sign-in?from=/sign-up');
  /* ======   useEffect   ====== */

  logger('render');
  return (
    <PageCenter title={t('회원가입')} icon="🔓">
      {!isMutating && error?.message && <p className="text-red-500">💥 {error?.message}</p>}

      <ModalWithPortal onClose={handleModalClose} open={success} hasButton={[t('확인')]} persist>
        <p className="whitespace-pre-line">{t('회원가입이 완료됐어요.\n확인을 누르면 로그인 페이지로 이동합니다.')}</p>
      </ModalWithPortal>
      <form className="flex flex-col gap-3">
        <label>
          <p className="font-medium uppercase">{t('이름')}</p>
          <Input
            {...register('name', {
              required: t('이름을 입력해주세요.'),
            })}
            placeholder={t('이름을 입력해주세요.')}
            error={!!errors?.name?.message}
            className="w-full"
          />
          {errors?.name?.message && <p className="text-red-500">💥 {errors?.name?.message}</p>}
        </label>
        <label>
          <p className="font-medium uppercase">{t('아이디')}</p>
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
          <p className="font-medium uppercase">{t('비밀번호')}</p>
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
            placeholder={t('동일한 비밀번호를 한번 더 입력해주세요.')}
            error={!!errors?.rpw?.message}
            type="password"
            className="w-full"
          />
          {errors?.rpw?.message && <p className="text-red-500">💥 {errors?.rpw?.message}</p>}
        </label>
        <Button smoothLoading onClick={handleAdapterSubmit(handleSubmit)}>
          {t('회원가입')}
        </Button>
      </form>
    </PageCenter>
  );
};

export default SignUp;
