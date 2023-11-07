import { useSignUp } from '!/auth/application/sign-up';
import PageCenter from '@/PageCenter';
import { Button, Input, ModalWithPortal } from '@library-frontend/ui';
import { createLogger, fakeApi } from '@package-frontend/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

/* ======   interface   ====== */
interface FormState {
  id: string;
  pw: string;
  rpw: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/SignUp');
const SignUp = () => {
  /* ======   variables   ====== */
  const {
    register,
    handleSubmit: useFormSumit,
    formState: { errors },
    watch,
  } = useForm<FormState>();
  const { trigger, error } = useSignUp();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  /* ======   function    ====== */
  const handleSubmit = async (arg: FormState) => {
    await trigger(arg);
    setSuccess(true);
  };
  const fakeWait = async () => {
    await fakeApi();
    navigate('/sign-in?from=/sign-up');
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <PageCenter title="회원가입" icon="🔓">
      {error?.message && <p className="text-red-500">💥 {error?.message}</p>}

      <ModalWithPortal onClose={fakeWait} open={success} hasButton={['OK']} persist>
        회원가입이 완료됐어요.
      </ModalWithPortal>
      <div className="flex flex-col gap-3 min-w-[500px]">
        <label>
          <p className="font-medium">아이디</p>
          <Input
            {...register('id', {
              required: '아이디를 입력해주세요.',
            })}
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
            type="password"
            className="w-full"
          />
          {errors?.pw?.message && <p className="text-red-500">💥 {errors?.pw?.message}</p>}
        </label>
        <label>
          <p className="font-medium">비밀번호 확인</p>
          <Input
            {...register('rpw', {
              required: '동일한 비밀번호를 한번 더 입력해주세요.',
              validate: (val: string) => {
                if (watch('pw') != val) {
                  return '비밀번호가 일치하지 않아요.';
                }
              },
            })}
            type="password"
            className="w-full"
          />
          {errors?.rpw?.message && <p className="text-red-500">💥 {errors?.rpw?.message}</p>}
        </label>
        <Button smoothLoading onClick={useFormSumit(handleSubmit)}>
          회원가입
        </Button>
      </div>
    </PageCenter>
  );
};

export default SignUp;
