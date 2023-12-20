export const enum STORAGE {
  'auth' = 'auth',
  'carrier/table' = 'carrier/table',
  'alarm/table' = 'alarm/table',
  'stats/calendar' = 'stats/calendar',
  'stats/keyword' = 'stats/keyword',
  'setting/page-size' = 'setting/page-size',
  'setting/duration' = 'setting/duration',
  'setting/view-browser' = 'setting/view-browser',
  'setting/control-pagination' = 'setting/control-pagination',
  'setting/alarm-sound' = 'setting/alarm-sound',
  'i18nextLng' = 'i18nextLng',
}
export type STORAGE_KEY = keyof typeof STORAGE;
