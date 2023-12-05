import { useUserList } from '!/auth/application/get-user-list';
import Table from '@/Table';
import { createLogger } from '#/logger';
import UserGradeSelect from './UserGradeSelect';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Users');
const Users = () => {
  /* ======   variables   ====== */
  const { data } = useUserList();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   trigger();
  // }, []);
  logger('render');
  return (
    <>
      <Table
        renderSubComponent={<UserGradeSelect />}
        thead={['uid', 'userId', 'userName', 'gradeName', 'createdDate', 'lastAccess']}
        data={data}
        makePagination
      />
    </>
  );
};

export default Users;
