export const enum QUERY_PARAM_TOAST {
  'session-expired' = 'session-expired',
  'success-sign-up' = 'success-sign-up',
  'success-update-password' = 'success-update-password',
}
export type QUERY_PARAM_TOAST_KEY = keyof typeof QUERY_PARAM_TOAST;

export const enum ROUTES_PATH {
  '/control' = '/control',
  '/stats' = '/stats',
  '/stats/summary' = '/stats/summary',
  '/stats/alarm' = '/stats/alarm',
  '/stats/carrier' = '/stats/carrier',
  '/users' = '/users',
  '/update-password' = '/update-password',
  '/sign-in' = '/sign-in',
  '/sign-up' = '/sign-up',
  '/help' = '/help',
}
