import { useUserList } from '!/auth/application/get-user-list';
import Table from '@/Table';
import { Select } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/UserGradeSelect');
const UserGradeSelect = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   trigger();
  // }, []);
  logger('render');
  return (
    <div>
      <Select></Select>
    </div>
  );
};

export default UserGradeSelect;
