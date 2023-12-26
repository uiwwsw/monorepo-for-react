import { useUserList } from '!/auth/application/get-user-list';
import Table from '@/Table';
// import { createLogger } from '@package-frontend/utils';
import UserInfo from './UserInfo';
import { useTranslation } from 'react-i18next';
import H1 from '@/Typography/H1';
import useSetting from '#/useSetting';
import { TheadUsers, fixHeadUsers, mustHaveColumnUsers } from '!/auth/domain';
import { storage } from '#/storage';
import { VisibilityState } from '@tanstack/react-table';
import { STORAGE } from '!/storage/domain';

/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('pages/Users');
const Users = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { pageSizeForUsers, columnForUsers } = useSetting();

  const fixedColumn = storage.get<VisibilityState>(STORAGE['stats/users/column']) ?? {};
  const thead = Object.entries(columnForUsers)
    .filter(([_, val]) => val)
    .map(([key]) => key) as TheadUsers[];
  const { data } = useUserList();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   trigger();
  // }, []);
  return (
    <>
      <H1>{t('유저관리')}</H1>
      <Table
        pageSize={pageSizeForUsers}
        renderSubComponent={<UserInfo />}
        thead={thead}
        mustHaveColumn={mustHaveColumnUsers}
        fixHead={fixHeadUsers}
        cacheColumnVisibility={fixedColumn}
        data={data}
        makePagination
      />
    </>
  );
};

export default Users;
