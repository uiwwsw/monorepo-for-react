import { useGetAuth } from '!/auth/application/get-auth';
import { useResetPassword } from '!/auth/application/put-reset-password';
import { useUpdateGrade } from '!/auth/application/put-update-grade';
import { User } from '!/auth/domain';
import WarningMessage from '@/Typography/WarningMessage';
import { Button, Input, Select, useToasts } from '@library-frontend/ui';
import { UserGrade } from '@package-backend/types';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { ChangeEvent, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

/* ======   interface   ====== */
export interface UserInfoProps {
  row?: Row<User>;
}
interface FormState {
  id: string;
  pw: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/UserInfo');
const UserInfo = ({ row }: UserInfoProps) => {
  /* ======   variables   ====== */
  const selectRef = useRef<HTMLSelectElement>(null);
  const { data: auth } = useGetAuth();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit: handleAdapterSubmit,
    formState: { errors },
  } = useForm<FormState>();
  const { Toasts, showToast } = useToasts();
  const { trigger: gradeTrigger, error: gradeError } = useUpdateGrade();
  const { trigger: passwordTrigger, error: passwordError } = useResetPassword();
  const options =
    Object.entries(UserGrade)
      .filter(([key]) => isNaN(+key))
      .map(([key, value]) => ({
        value: value as string,
        label: key,
      })) ?? [];
  /* ======   function    ====== */
  const handleChangeGrade = async (e: ChangeEvent<HTMLSelectElement>) => {
    const grade = +e.target.value;
    if (!row || isNaN(grade)) return;
    const id = row.original.userId;
    if (!id) return;
    try {
      await gradeTrigger({ id, grade });
      mutate('/api/users/user-list');
      showToast({
        duration: 5000,
        message: t('{{id}} 유저의 등급을 {{grade}} 등급으로 바꿨습니다', { id, grade: UserGrade[grade].toLowerCase() }),
      });
    } catch {
      logger('djawkldjklawd');
      selectRef.current && row?.original.grade && (selectRef.current.value = row?.original.grade.toString());
      logger('djawkldjklawd', selectRef.current?.value);
    }
  };
  const handleResetPassword = async (arg: FormState) => {
    await passwordTrigger(arg);
    showToast({
      duration: 5000,
      message: t('{{id}} 유저의 비밀번호를 변경했습니다.', { id: arg.id }),
    });
  };
  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <div className="flex p-2 items-center justify-center gap-10">
        <div>
          <div className="flex gap-2 items-center">
            <span>{t('{{id}} 등급 변경', { id: row?.original.userId })}: </span>
            <Select
              error={!!gradeError?.message}
              defaultValue={row?.original.grade}
              options={options}
              onChange={handleChangeGrade}
            />
          </div>
          <WarningMessage>{gradeError?.message}</WarningMessage>
        </div>
        {auth?.grade === UserGrade.ADMIN && (
          <form>
            <div className="flex gap-2 items-center">
              <label>
                {t('{{id}} 비번 변경', { id: row?.original.userId })}:
                <Input
                  {...register('pw', {
                    required: t('비밀번호를 입력해주세요.'),
                  })}
                  autoComplete="pw"
                  placeholder={t('비밀번호를 입력해주세요.')}
                  error={!!errors?.pw?.message}
                  type="password"
                />
              </label>
              <Button smoothLoading onClick={handleAdapterSubmit(handleResetPassword)}>
                {t('비밀번호 리셋')}
              </Button>
            </div>
            <WarningMessage>{errors?.pw?.message ?? passwordError?.message}</WarningMessage>
          </form>
        )}
      </div>
    </>
  );
};

export default UserInfo;
