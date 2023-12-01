import { useUpdateGrade } from '!/auth/application/put-update-grade';
import { User } from '!/auth/domain';
import { Select, useToasts } from '@library-frontend/ui';
import { UserGrade } from '@package-backend/types';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

/* ======   interface   ====== */
export interface UserGradeSelectProps {
  row?: Row<User>;
}
/* ======    global     ====== */
const logger = createLogger('pages/UserGradeSelect');
const UserGradeSelect = ({ row }: UserGradeSelectProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { Toasts, showToast } = useToasts();
  const { trigger } = useUpdateGrade();
  const options =
    Object.entries(UserGrade)
      .filter(([key]) => isNaN(+key))
      .map(([key, value]) => ({
        value: value as string,
        label: key,
      })) ?? [];
  // row?.original.grade
  /* ======   function    ====== */
  //   await trigger({ id: row.original.userId, grade: 1 });
  //   mutate('/api/users/user-list');
  // };
  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const grade = +e.target.value;
    if (!row || isNaN(grade)) return;
    const id = row.original.userId;
    logger(id, grade);
    await trigger({ id, grade });
    mutate('/api/users/user-list');
    showToast({ message: t('{{id}} 유저의 등급을 {{grade}} 등급으로 바꿨습니다', { id, grade: UserGrade[grade] }) });
  };
  /* ======   useEffect   ====== */
  logger('render', row);
  return (
    <>
      {Toasts}
      <div className="flex p-2 items-center justify-end">
        <span>유저 등급 변경: </span>
        <Select defaultValue={row?.original.grade} options={options} onChange={handleChange} />
      </div>
    </>
  );
};

export default UserGradeSelect;
