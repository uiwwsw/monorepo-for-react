import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUpdatePassword } from '!/auth/application/put-update-password';
import { useState } from 'react';

/* ======   interface   ====== */
interface FormState {
  id: string;
  pw: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/UpdatePassword');
const UpdatePassword = () => {
  /* ======   variables   ====== */
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit: handleAdapterSubmit,
    formState: { errors },
  } = useForm<FormState>();
  const { trigger, error, isMutating } = useUpdatePassword();
  /* ======   function    ====== */

  const handleSubmit = async (arg: FormState) => {
    await trigger(arg);
    setSuccess(true);
  };
  const handleModalClose = () => navigate('/sign-in?update-profile=true');
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <ModalWithPortal onClose={handleModalClose} open={success} hasButton={[t('로그인 페이지로 이동')]} persist>
        {t('비밀번호가 변경됐어요. 세션이 만료되어 다시 로그인해야 합니다.')}
      </ModalWithPortal>
      <PageCenter title={t('비밀번호 변경')} icon="🔏">
        {!isMutating && error?.message && <p className="text-red-500">💥 {error?.message}</p>}

        <form className="flex flex-col gap-3">
          <label>
            <p className="font-medium">{t('비밀번호')}</p>
            <Input
              {...register('pw', {
                required: t('비밀번호를 입력해주세요.'),
              })}
              autoComplete="new-password"
              placeholder={t('비밀번호를 입력해주세요.')}
              error={!!errors?.pw?.message}
              type="password"
              className="w-full"
            />
            {errors?.pw?.message && <p className="text-red-500">💥 {errors?.pw?.message}</p>}
          </label>
          <Button smoothLoading onClick={handleAdapterSubmit(handleSubmit)}>
            {t('비밀번호 변경')}
          </Button>
        </form>
      </PageCenter>
    </>
  );
};

export default UpdatePassword;
