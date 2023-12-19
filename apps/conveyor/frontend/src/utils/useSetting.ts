// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */

import { STORAGE } from '!/storage/domain';
import { storage } from './storage';

export interface useSettingProps {}
/* ======    global     ====== */
// const logger = createLogger('utils/useSetting');
const useSetting = (_?: useSettingProps) => {
  /* ======   variables   ====== */
  const pageSize = storage.get<number>(STORAGE['setting/page-size']) ?? 10;
  const duration = storage.get<number>(STORAGE['setting/duration']) ?? 7;
  const viewBrowser = storage.get<boolean>(STORAGE['setting/view-browser']) ?? false;
  const controlPagination = storage.get<boolean>(STORAGE['setting/control-pagination']) ?? false;

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return {
    viewBrowser,
    pageSize,
    duration,
    controlPagination,
  };
};

export default useSetting;
