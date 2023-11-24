import { useUpdateGrade } from '!/auth/application/put-update-grade';
import { User } from '!/auth/domain';
import { Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { mutate } from 'swr';

/* ======   interface   ====== */
export interface UserGradeSelectProps {
  row?: Row<User>;
}
/* ======    global     ====== */
const logger = createLogger('pages/UserGradeSelect');
const UserGradeSelect = ({ row }: UserGradeSelectProps) => {
  /* ======   variables   ====== */
  const { trigger } = useUpdateGrade();
  /* ======   function    ====== */
  const handleClick = async () => {
    if (!row) return;
    await trigger({ id: row.original.userId, grade: 1 });
    mutate('/api/users/user-list');
  };
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   trigger();
  // }, []);
  logger('render', row);
  return (
    <div>
      <Button onClick={handleClick}>임시버튼</Button>
      {/* <Select></Select> */}
    </div>
  );
};

export default UserGradeSelect;
