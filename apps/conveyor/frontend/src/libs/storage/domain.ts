export const enum STORAGE {
  'auth' = 'auth',
  'carrier/table' = 'carrier/table',
  'alarm/table' = 'alarm/table',
  'stats/calendar' = 'stats/calendar',
  'setting/default-page-size' = 'setting/default-page-size',
  'setting/default-duration' = 'setting/default-duration',
  'setting/default-view-browser' = 'setting/default-view-browser',
  'i18nextLng' = 'i18nextLng',
}
export type STORAGE_KEY = keyof typeof STORAGE;
