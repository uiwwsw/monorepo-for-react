import { STResponse, STResponseFailed, STResponseSuccess } from '@package-backend/types';
import { createLogger } from './logger';
const logger = createLogger('utils/http');
export const http = async <T>(
  url: string,
  params?: {
    arg?: unknown;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    file?: File; // TODO 파일 넘어오면 바디 스트링기파이 제거하고  폼데이터로 변경, 헤더 제거등등 처리
  },
) => {
  let requestHeaders = {
    'Content-type': 'application/json',
  };

  const requestMethod = params?.method ?? 'GET';
  let requestBody: string | null = params?.arg ? JSON.stringify(params?.arg) : null;
  let requestUrl = url;

  // GET 메소드에 대한 처리
  if (requestMethod === 'GET' && requestBody) {
    const urlObj = new URLSearchParams(params?.arg as Record<string, string>).toString();
    requestUrl = url + '?' + urlObj.toString();
    requestBody = null; // GET 요청에는 보통 body가 없습니다.
  }

  // 나머지 메소드에 대한 처리 (TODO: 파일 처리, 다른 컨텐트 타입 등)
  if (params?.file) {
    // 파일 처리 로직
  }

  logger({
    headers: requestHeaders,
    method: requestMethod,
    body: requestBody,
  });

  const res = await fetch(requestUrl, {
    headers: requestHeaders,
    method: requestMethod,
    body: requestBody,
  });

  try {
    const json = (await res.json()) as STResponse<T>;
    if (res.ok) return json.data as STResponseSuccess<T>;
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
  }
}
