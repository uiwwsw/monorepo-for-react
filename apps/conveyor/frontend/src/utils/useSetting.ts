// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */

import { STORAGE } from '!/storage/domain';
import { storage } from './storage';

export interface useSettingProps {}
/* ======    global     ====== */
// const logger = createLogger('utils/useSetting');
const useSetting = (_?: useSettingProps) => {
  /* ======   variables   ====== */
  const defaultPageSize = storage.get<number>(STORAGE['setting/default-page-size']) ?? 10;
  const defaultDuration = storage.get<number>(STORAGE['setting/default-duration']) ?? 7;
  const defaultViewBrowser = storage.get<boolean>(STORAGE['setting/default-view-browser']) ?? false;

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return {
    defaultViewBrowser,
    defaultPageSize,
    defaultDuration,
  };
};

export default useSetting;
