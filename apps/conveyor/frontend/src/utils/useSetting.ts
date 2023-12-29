// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */

import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
import { TheadAlarm, TheadCarrier, TheadSummary, theadAlarm, theadCarrier, theadSummary } from '!/stats/domain';
import { TheadUsers, theadUsers } from '!/auth/domain';

export interface useSettingProps {}
/* ======    global     ====== */
// const logger = createLogger('utils/useSetting');
const useSetting = (_?: useSettingProps) => {
  /* ======   variables   ====== */
  const pageSize = storage.get<number>(STORAGE['setting/page-size']) ?? 10;
  const duration = storage.get<number>(STORAGE['setting/duration']) ?? 7;
  const logBrowser = storage.get<boolean>(STORAGE['setting/log-browser']) ?? true;
  const logBrowserMultiple = storage.get<boolean>(STORAGE['setting/log-browser-multiple']) ?? true;
  const alarmSound = storage.get<boolean>(STORAGE['setting/alarm-sound']) ?? true;

  const controlPagination = storage.get<boolean>(STORAGE['setting/control-pagination']) ?? false;
  const pageSizeForTcm = storage.get<number>(STORAGE['setting/control/tcm/page-size']) ?? undefined;
  const pageSizeForSummary = storage.get<number>(STORAGE['setting/stats/summary/page-size']) ?? undefined;
  const pageSizeForAlarm = storage.get<number>(STORAGE['setting/stats/alarm/page-size']) ?? undefined;
  const pageSizeForCarrier = storage.get<number>(STORAGE['setting/stats/carrier/page-size']) ?? undefined;
  const pageSizeForUsers = storage.get<number>(STORAGE['setting/users/page-size']) ?? undefined;

  const durationForSummary = storage.get<number>(STORAGE['setting/stats/summary/duration']) ?? undefined;
  const durationForAlarm = storage.get<number>(STORAGE['setting/stats/alarm/duration']) ?? undefined;
  const durationForCarrier = storage.get<number>(STORAGE['setting/stats/carrier/duration']) ?? undefined;

  const columnForSummary =
    storage.get<Record<TheadSummary, boolean>>(STORAGE['setting/stats/summary/column']) ??
    theadSummary.reduce((a, v) => ({ ...a, [v]: true }), {} as Record<TheadSummary, boolean>);
  const columnForAlarm =
    storage.get<Record<TheadAlarm, boolean>>(STORAGE['setting/stats/alarm/column']) ??
    theadAlarm.reduce((a, v) => ({ ...a, [v]: true }), {} as Record<TheadAlarm, boolean>);
  const columnForCarrier =
    storage.get<Record<TheadCarrier, boolean>>(STORAGE['setting/stats/carrier/column']) ??
    theadCarrier.reduce((a, v) => ({ ...a, [v]: true }), {} as Record<TheadCarrier, boolean>);

  const columnForUsers =
    storage.get<Record<TheadUsers, boolean>>(STORAGE['setting/users/column']) ??
    theadUsers.reduce((a, v) => ({ ...a, [v]: true }), {} as Record<TheadUsers, boolean>);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return {
    logBrowser,
    logBrowserMultiple,
    pageSize,
    duration,
    controlPagination,
    alarmSound,
    pageSizeForTcm: pageSizeForTcm ?? pageSize,
    pageSizeForTcmSetting: pageSizeForTcm,
    pageSizeForSummary: pageSizeForSummary ?? pageSize,
    pageSizeForSummarySetting: pageSizeForSummary,
    pageSizeForAlarm: pageSizeForAlarm ?? pageSize,
    pageSizeForAlarmSetting: pageSizeForAlarm,
    pageSizeForCarrier: pageSizeForCarrier ?? pageSize,
    pageSizeForCarrierSetting: pageSizeForCarrier,
    pageSizeForUsers: pageSizeForUsers ?? pageSize,
    pageSizeForUsersSetting: pageSizeForUsers,
    durationForSummary: durationForSummary ?? duration,
    durationForSummarySetting: durationForSummary,
    durationForAlarm: durationForAlarm ?? duration,
    durationForAlarmSetting: durationForAlarm,
    durationForCarrier: durationForCarrier ?? duration,
    durationForCarrierSetting: durationForCarrier,
    columnForSummary,
    columnForAlarm,
    columnForCarrier,
    columnForUsers,
  };
};

export default useSetting;
