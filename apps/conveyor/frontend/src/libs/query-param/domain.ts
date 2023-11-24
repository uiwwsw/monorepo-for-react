export const enum AUTH_TOAST {
  'session-expired' = 'session-expired',
  'success-sign-up' = 'success-sign-up',
  'success-update-password' = 'success-update-password',
}
export type AUTH_TOAST_KEY = keyof typeof AUTH_TOAST;
