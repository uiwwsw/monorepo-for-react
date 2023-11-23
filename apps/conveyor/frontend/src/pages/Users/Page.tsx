import { useUserList } from '!/auth/application/get-user-list';
import Table from '@/Table';
import { Select } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
import PageCenter from 'src/components/PageCenter';

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
  logger('render');
  return (
    <>
      <PageCenter title={t('유저관리')}>
        <Table
          renderSubComponent={<Select />}
          thead={['uid', 'user_id', 'user_name', 'grade', 'created_date', 'last_access']}
          data={data}
        />
      </PageCenter>
    </>
  );
};

export default Users;
