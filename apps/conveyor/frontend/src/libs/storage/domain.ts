export const enum STORAGE {
  'auth' = 'auth',
  'carrier/table' = 'carrier/table',
  'alarm/table' = 'alarm/table',
  'stats/calendar' = 'stats/calendar',
  'setting/page-size' = 'setting/page-size',
  'setting/duration' = 'setting/duration',
  'setting/view-browser' = 'setting/view-browser',
  'setting/control-pagination' = 'setting/control-pagination',
  'i18nextLng' = 'i18nextLng',
}
export type STORAGE_KEY = keyof typeof STORAGE;
