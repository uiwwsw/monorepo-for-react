import { Auth } from '!/auth/domain';
import { STORAGE } from '!/storage/domain';
import { SIGN_IN_QUERY_PARAM_TOAST } from '!/routes/domain';
import { STResponse, STResponseFailed, STResponseSuccess } from '@package-backend/types';
import { createLogger } from '@package-frontend/utils';
import { t } from 'src/i18n';
import { storage } from './storage';
const logger = createLogger('utils/http');
export const enum HTTP_ERROR_TYPE {
  AUTH = 4,
  SERVER,
}
export const http = async <T>({
  url,
  arg,
  method = 'GET',
  contentType = 'application/json',
  file,
  params,
  timeout = 60000,
}: {
  timeout?: number;
  url: string;
  contentType?: string;
  arg?: T;
  params?: T;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  file?: File; // TODO 파일 넘어오면 바디 스트링기파이 제거하고  폼데이터로 변경, 헤더 제거등등 처리
}) => {
  const auth = storage.get<Auth>(STORAGE['auth']);
  const headers: Record<string, string> = {
    'Content-type': contentType,
  };
  if (auth?.token) headers['x-access-token'] = auth.token;
  let body: FormData | string | null = arg ? JSON.stringify(arg) : null;

  // GET 메소드에 대한 처리
  if (params) {
    const urlObj = new URLSearchParams(arg as Record<string, string>).toString();
    url += '?' + urlObj.toString();
  }

  if (method === 'GET') body = null;

  // 나머지 메소드에 대한 처리 (TODO: 파일 처리, 다른 컨텐트 타입 등)
  if (file) {
    body = new FormData();
    body.append('file', file);
  }

  logger({
    headers,
    body,
  });

  const controller = new AbortController();
  const sti = setTimeout(() => controller.abort(), timeout);
  const res = await fetch(url, {
    headers,
    method,
    body,
    signal: controller.signal,
  });
  clearTimeout(sti);
  if (res.ok) return res;
  const message = await res.text();
  throw new HttpError(message, res);
};
export const toText = async (res: Response) => {
  const text = await res.text();
  return text;
};
export const toBlob = async (res: Response) => {
  const blob = await res.blob();
  return blob;
};
// export const toTest = async <T>(data: unknown): Promise<T> =>
//   data instanceof Array
//     ? (data.map((x) => toTest(x)) as T)
//     : data instanceof Object
//     ? Object.entries(data).reduce((a, [key, value]) => {
//         return {
//           ...a,
//           [key]: value,
//         };
//       }, {} as T)
//     : (data as T);

// export const toJson = async <T>(res: Response) => {
//   const json = (await res.json()) as STResponse<T>;
//   if (json?.data) return toFormat(json.data) as STResponseSuccess<T>;
//   if (json.message) throw new HttpError(json.message, res);
//   return toFormat(json) as STResponseSuccess<T>;
// };
export const toJson = async <T>(res: Response) => {
  const json = (await res.json()) as STResponse<T>;
  if (json?.data) return json.data as STResponseSuccess<T>;
  if (json.message) throw new HttpError(json.message, res);
  return json as STResponseSuccess<T>;
};
export class HttpError extends Error implements STResponseFailed {
  status: number;
  statusText: string;
  get type() {
    switch (this.status) {
      case 404:
        return 5;
      default:
        return Math.floor(this.status / 100);
    }
  }
  get query() {
    const url = new URLSearchParams();
    url.append('from', location.pathname);
    switch (this.status) {
      case 401:
        url.append('toast', SIGN_IN_QUERY_PARAM_TOAST['session-expired']);
        break;
      case 403:
        url.append('toast', SIGN_IN_QUERY_PARAM_TOAST['invalid-session']);
        break;
    }

    if (url.size === 0) return '';

    return `?${url.toString()}`;
  }
  constructor(msg: string, res: Partial<Response>) {
    super(msg);
    this.status = res?.status ?? 0;
    this.statusText = res.statusText ?? 'unknown error';
    if (HTTP_ERROR_TYPE.SERVER === this.type) msg = '서버에 문제가 발생한 것 같아요.🤦‍♂️';
    this.message = t(msg);

    if (HTTP_ERROR_TYPE.AUTH === this.type) {
      storage.set(STORAGE['auth']);
      location.replace(`/sign-in${this.query}`);
    }
  }
}
