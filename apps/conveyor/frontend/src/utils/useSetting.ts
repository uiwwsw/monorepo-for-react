// import { createLogger } from '#/logger';
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

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return {
    defaultPageSize,
    defaultDuration,
  };
};

export default useSetting;
