import { useResetPassword } from '!/auth/application/put-reset-password';
import { useUpdateGrade } from '!/auth/application/put-update-grade';
import { User } from '!/auth/domain';
import Test from '@/Test';
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
  pw: string;
}
/* ======    global     ====== */
const logger = createLogger('pages/UserInfo');
const UserInfo = ({ row }: UserInfoProps) => {
  /* ======   variables   ====== */
  const selectRef = useRef<HTMLSelectElement>(null);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit: formSubmit,
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
    logger(e, row?.original.userId);
    const grade = +e.target.value;
    if (!row || isNaN(grade)) return;
    const id = row.original.userId;
    if (!id) return;
    try {
      await gradeTrigger({ id, grade });
      mutate('/api/users/user-list');
      showToast({
        duration: 5000,
        type: 'success',
        message: t('{{id}} 유저의 등급을 {{grade}} 등급으로 바꿨습니다', { id, grade: UserGrade[grade].toLowerCase() }),
      });
    } catch {
      selectRef.current && row?.original.grade && (selectRef.current.value = row?.original.grade.toString());
      showToast({
        type: 'fail',
        message: t('{{id}} 유저의 등급을 변경하는데 문제가 발생했습니다.', { id }),
      });
    }
  };
  const handleResetPassword = async ({ pw }: FormState) => {
    const id = row?.original.userId;
    if (!id) return showToast({ message: 'id가 없습니다.' });
    try {
      await passwordTrigger({ id, pw });
      showToast({
        duration: 5000,
        type: 'success',
        message: t('{{id}}의 비밀번호를 변경했습니다.', { id }),
      });
    } catch {
      showToast({
        type: 'fail',
        message: t('{{id}}의 비밀번호를 변경하는데 문제가 발생했습니다.', { id }),
      });
    }
  };
  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <div className="flex p-2 items-center justify-center gap-7 max-lg:!block max-lg:w-fit max-lg:m-auto sticky left-0 right-0">
        <div>
          <div className="flex gap-4 items-center">
            <span>{t('{{userName}}님 등급 변경', { userName: row?.original.userName })}: </span>
            <Select
              ref={selectRef}
              error={!!gradeError?.message}
              defaultValue={row?.original.grade}
              options={options}
              onChange={handleChangeGrade}
            />
          </div>
          <WarningMessage>{gradeError?.message}</WarningMessage>
        </div>
        <i className="h-16 border-dashed border-r-2 border-gray-500 max-lg:!hidden" />
        <form>
          <div className="flex gap-4 items-center max-lg:!block">
            <label>
              <span className="mr-4">{t('{{userName}}님 비번 변경', { userName: row?.original.userName })}:</span>
              <Input
                {...register('pw', {
                  required: t('재설정할 암호를 입력하십시오.'),
                })}
                autoComplete="pw"
                placeholder={t('재설정할 암호를 입력하십시오.')}
                error={!!errors?.pw?.message}
                type="password"
              />
            </label>
            <Button smoothLoading onClick={formSubmit(handleResetPassword)}>
              <Test className="left-0 top-0">{t('비밀번호 리셋')}</Test>
            </Button>
          </div>
          <WarningMessage>{errors?.pw?.message ?? passwordError?.message}</WarningMessage>
        </form>
      </div>
    </>
  );
};

export default UserInfo;
