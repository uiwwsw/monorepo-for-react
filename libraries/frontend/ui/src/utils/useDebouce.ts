import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';

const logger = createLogger('utils/useDebounce');
const useDebounce = <T>(fn?: (e: T) => unknown, delay: number = 300) => {
  if (!fn) return () => null;
  const [isDebouncing, setIsDebouncing] = useState(false);
  const handleRun = (e: T) => {
    logger('이벤트 시도', isDebouncing);
    if (isDebouncing) return;
    setIsDebouncing(true);

    setTimeout(() => {
      logger('이벤트 실행', e);
      fn(e);
      setIsDebouncing(false);
    }, delay);
  };

  return handleRun;
};

export default useDebounce;
