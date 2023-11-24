import { useUserList } from '!/auth/application/get-user-list';
import Table from '@/Table';
import { createLogger } from '@package-frontend/utils';
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
        thead={['uid', 'userId', 'userName', 'grade', 'createdDate', 'lastAccess']}
        data={data}
      />
    </>
  );
};

export default Users;
