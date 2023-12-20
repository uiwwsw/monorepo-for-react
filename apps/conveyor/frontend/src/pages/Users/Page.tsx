import { useUserList } from '!/auth/application/get-user-list';
import Table from '@/Table';
// import { createLogger } from '@package-frontend/utils';
import UserInfo from './UserInfo';
import { useTranslation } from 'react-i18next';
import H1 from '@/Typography/H1';

/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('pages/Users');
const Users = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

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
        renderSubComponent={<UserInfo />}
        thead={['uid', 'userId', 'userName', 'gradeName', 'createdDate', 'lastAccess']}
        fixHead={{
          uid: t('유니크 아이디'),
          userId: t('유저 아이디'),
          userName: t('유저 이름'),
          gradeName: t('등급'),
          createdDate: t('생성일'),
          lastAccess: t('최근 접속일'),
        }}
        data={data}
        makePagination
      />
    </>
  );
};

export default Users;
