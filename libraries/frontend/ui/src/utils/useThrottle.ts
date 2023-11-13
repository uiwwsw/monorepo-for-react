import { createLogger } from '@package-frontend/utils';
import { useRef } from 'react';

const logger = createLogger('utils/useThrottle');
const useThrottle = <T>(fn?: (e: T) => unknown, delay: number = 300) => {
  if (!fn) return () => null;
  const ref = useRef(false);
  const handleRun = (e: T) => {
    logger('이벤트 시도', ref.current);
    if (ref.current) return;
    ref.current = true;

    logger('이벤트 실행', e);
    fn(e);
    setTimeout(() => (ref.current = false), delay);
  };

  return handleRun;
};

export default useThrottle;
