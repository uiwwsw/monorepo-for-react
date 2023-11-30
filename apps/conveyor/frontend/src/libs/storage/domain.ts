export const enum STORAGE {
  '/check-auth' = '/check-auth',
  'carrier/table' = 'carrier/table',
  'alarm/table' = 'alarm/table',
  'stats/calendar' = 'stats/calendar',
}
export type STORAGE_KEY = keyof typeof STORAGE;
