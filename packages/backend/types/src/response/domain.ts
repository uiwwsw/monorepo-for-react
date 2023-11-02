export interface STResponse<T = unknown> {
  data?: T;
  message?: string;
}
export type STResponseSuccess<T> = STResponse<T>['data'];
export type STResponseFailed = Omit<STResponse, 'data'>;
