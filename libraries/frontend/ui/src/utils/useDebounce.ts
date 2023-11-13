import { createLogger } from '@package-frontend/utils';
import { useRef } from 'react';

const logger = createLogger('utils/useDebounce');
const useDebounce = <T>(fn?: (e: T) => unknown, delay: number = 300) => {
  if (!fn) return () => null;
  const ref = useRef(false);
  const handleRun = (e: T) => {
    logger('이벤트 시도', ref.current);
    if (ref.current) return;
    ref.current = true;

    setTimeout(async () => {
      logger('이벤트 실행', e);
      await fn(e);
      ref.current = false;
    }, delay);
  };

  return handleRun;
};

export default useDebounce;
