import { Auth } from '!/auth/domain';
import { STORAGE } from '!/storage/domain';
import { SIGN_IN_QUERY_PARAM_TOAST } from '!/routes/domain';
import { STResponse, STResponseFailed, STResponseSuccess } from '@package-backend/types';
import { LocalStorage, createLogger, toData } from '@package-frontend/utils';
import i18n from 'src/i18n';
const logger = createLogger('utils/http');
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
    const json = (await res.json()) as STResponse<T>;
    if (res.ok && json?.data) return toData(json.data) as STResponseSuccess<T>;
    throw new HttpError(json.message ?? 'unknown error', res);
  } catch (e) {
    const { message } = e as Error;
    throw new HttpError(message ?? 'unknown error', res);
  }
};
export class HttpError extends Error implements STResponseFailed {
  status: number;
  statusText: string;
  constructor(msg: string, res: Response) {
    super(msg);
    this.status = res.status;
    this.statusText = res.statusText;
    if (this.status === 500)
      this.message = i18n.t('{{api}} 서버에 문제가 발생한 것 같아요.🤦‍♂️', { api: import.meta.env.VITE_API });
    if (this.status === 401) {
      LocalStorage.set(STORAGE['/check-auth']);
      location.href = `/sign-in?toast=${SIGN_IN_QUERY_PARAM_TOAST['session-expired']}`;
    }
  }
}
