import { Auth } from '!/auth/domain';
import { STORAGE } from '!/storage/domain';
import { SIGN_IN_QUERY_PARAM_TOAST } from '!/routes/domain';
import { STResponse, STResponseFailed, STResponseSuccess } from '@package-backend/types';
import { LocalStorage, createLogger, toData } from '@package-frontend/utils';
import i18n from 'src/i18n';
const logger = createLogger('utils/http');
export const enum HttpErrorType {
  AUTH = 4,
  SERVER,
}
export const http = async <T>({
  url,
  arg,
  method = 'GET',
  file,
}: {
  url: string;
  arg?: unknown;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  file?: File; // TODO 파일 넘어오면 바디 스트링기파이 제거하고  폼데이터로 변경, 헤더 제거등등 처리
}) => {
  const auth = LocalStorage.get<Auth>(STORAGE['/check-auth']);
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };
  if (auth?.token) headers['x-access-token'] = auth.token;
  let body: string | null = arg ? JSON.stringify(arg) : null;

  // GET 메소드에 대한 처리
  if (method === 'GET' && body) {
    const urlObj = new URLSearchParams(arg as Record<string, string>).toString();
    url += '?' + urlObj.toString();
    body = null; // GET 요청에는 보통 body가 없습니다.
  }

  // 나머지 메소드에 대한 처리 (TODO: 파일 처리, 다른 컨텐트 타입 등)
  if (file) {
    // 파일 처리 로직
  }

  logger({
    headers,
    body,
  });

  const res = await fetch(url, {
    headers,
    method,
    body,
  });

  try {
    if (res.ok) {
      const json = (await res.json()) as STResponse<T>;
      if (json?.data) return toData(json.data) as STResponseSuccess<T>;
      throw new HttpError(json.message ?? 'unknown error', res);
    } else {
      const text = await res.text();
      const error = new HttpError(text, res);
      if (error.type === HttpErrorType.SERVER) throw error;
    }
  } catch (e) {
    const { message } = e as Error;
    throw new HttpError(message, res);
  }
};
export class HttpError extends Error implements STResponseFailed {
  status: number;
  statusText: string;
  get type() {
    return Math.floor(this.status / 100);
  }
  get query() {
    const url = new URLSearchParams();
    url.append('from', location.pathname);
    if (this.status === 401) url.append('toast', SIGN_IN_QUERY_PARAM_TOAST['session-expired']);
    if (this.status === 403) url.append('toast', SIGN_IN_QUERY_PARAM_TOAST['invalid-session']);

    if (url.size === 0) return '';

    return `?${url.toString()}`;
  }
  constructor(msg: string, res: Partial<Response>) {
    super(msg);
    this.status = res?.status ?? 0;
    this.statusText = res.statusText ?? 'unknown error';
    if (HttpErrorType.SERVER === this.type) this.message = i18n.t('api 서버에 문제가 발생한 것 같아요.🤦‍♂️');

    if (HttpErrorType.AUTH === this.type) {
      LocalStorage.set(STORAGE['/check-auth']);
      location.replace(`/sign-in${this.query}`);
    }
  }
}
