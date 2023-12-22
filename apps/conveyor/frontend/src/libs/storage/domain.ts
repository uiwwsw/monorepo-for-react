export const enum STORAGE {
  'auth' = 'auth',
  'stats/calendar' = 'stats/calendar',
  'stats/keyword' = 'stats/keyword',

  'stats/summary/column' = 'stats/summary/column',
  'stats/carrier/column' = 'stats/carrier/column',
  'stats/alarm/column' = 'stats/alarm/column',
  'i18nextLng' = 'i18nextLng',

  'setting/page-size' = 'setting/page-size',
  'setting/duration' = 'setting/duration',
  'setting/view-browser' = 'setting/view-browser',
  'setting/control-pagination' = 'setting/control-pagination',
  'setting/alarm-sound' = 'setting/alarm-sound',

  'setting/control/tcm/page-size' = 'setting/control/tcm/page-size',
  'setting/stats/summary/page-size' = 'setting/stats/summary/page-size',
  'setting/stats/alarm/page-size' = 'setting/stats/alarm/page-size',
  'setting/stats/carrier/page-size' = 'setting/stats/carrier/page-size',
  'setting/users/page-size' = 'setting/users/page-size',

  'setting/stats/summary/duration' = 'setting/stats/summary/duration',
  'setting/stats/alarm/duration' = 'setting/stats/alarm/duration',
  'setting/stats/carrier/duration' = 'setting/stats/carrier/duration',

  'setting/stats/summary/column' = 'setting/stats/summary/column',
  'setting/stats/alarm/column' = 'setting/stats/alarm/column',
  'setting/stats/carrier/column' = 'setting/stats/carrier/column',
}
export type STORAGE_KEY = keyof typeof STORAGE;
