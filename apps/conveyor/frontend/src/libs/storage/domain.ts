export const enum STORAGE {
  'auth' = 'auth',
  'version' = 'version',
  'tutorial' = 'tutorial',
  'stats/calendar' = 'stats/calendar',
  'stats/keyword' = 'stats/keyword',

  'users/column' = 'users/column',
  'stats/summary/column' = 'stats/summary/column',
  'stats/carrier/column' = 'stats/carrier/column',
  'stats/alarm/column' = 'stats/alarm/column',
  'i18nextLng' = 'i18nextLng',

  'setting/page-size' = 'setting/page-size',
  'setting/duration' = 'setting/duration',
  'setting/log-browser' = 'setting/log-browser',
  'setting/log-browser-multiple' = 'setting/log-browser-multiple',
  'setting/control-pagination' = 'setting/control-pagination',
  'setting/alarm-sound' = 'setting/alarm-sound',

  'setting/control/tcm/page-size' = 'setting/control/tcm/page-size',
  'setting/stats/summary/page-size' = 'setting/stats/summary/page-size',
  'setting/stats/alarm/page-size' = 'setting/stats/alarm/page-size',
  'setting/stats/carrier/page-size' = 'setting/stats/carrier/page-size',
  'setting/stats/carrier/table/filter' = 'setting/stats/carrier/table/filter',

  'setting/users/page-size' = 'setting/users/page-size',

  'setting/stats/summary/duration' = 'setting/stats/summary/duration',
  'setting/stats/alarm/duration' = 'setting/stats/alarm/duration',
  'setting/stats/alarm/table/filter' = 'setting/stats/alarm/table/filter',
  'setting/stats/carrier/duration' = 'setting/stats/carrier/duration',

  'setting/stats/summary/column' = 'setting/stats/summary/column',
  'setting/stats/alarm/column' = 'setting/stats/alarm/column',
  'setting/stats/carrier/column' = 'setting/stats/carrier/column',

  'setting/users/column' = 'setting/users/column',
}
export type STORAGE_KEY = keyof typeof STORAGE;
