export const enum STORAGE {
  'auth' = 'auth',
  'carrier/table' = 'carrier/table',
  'alarm/table' = 'alarm/table',
  'stats/calendar' = 'stats/calendar',
}
export type STORAGE_KEY = keyof typeof STORAGE;
