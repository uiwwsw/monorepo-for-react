import { useUserList } from '!/auth/application/get-user-list';
import Table from '@/Table';
import { createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
import PageCenter from 'src/components/PageCenter';
import UserGradeSelect from './UserGradeSelect';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Users');
const Users = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { data } = useUserList();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   trigger();
  // }, []);
  logger('render', data);
  return (
    <>
      <PageCenter title={t('유저관리')}>
        <Table
          renderSubComponent={<UserGradeSelect />}
          thead={['uid', 'user_id', 'user_name', 'grade', 'created_date', 'last_access']}
          data={data}
        />
      </PageCenter>
    </>
  );
};

export default Users;
