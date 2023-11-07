import { STResponse, STResponseFailed, STResponseSuccess } from '@package-backend/types';
import { createLogger } from './logger';
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
  let headers = {
    'Content-type': 'application/json',
  };

  let body: string | null = arg ? JSON.stringify(arg) : null;

  // GET 메소드에 대한 처리
  if (method === 'GET' && body) {
    const urlObj = new URLSearchParams(arg as Record<string, string>).toString();
    url += urlObj.toString();
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
