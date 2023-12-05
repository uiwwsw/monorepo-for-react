import { createLogger } from '#/logger';
import { useRef } from 'react';

const logger = createLogger('utils/useThrottle');
const useThrottle = <T>(fn?: (e: T) => unknown, delay: number = 300) => {
  if (!fn) return () => null;
  const sto = useRef<NodeJS.Timeout | null>();
  const handleRun = (e: T) => {
    if (!sto.current) {
      sto.current = setTimeout(async () => {
        logger('이벤트 실행', e);
        sto.current = null;
        return await fn(e);
      }, delay);
    }
  };

  return handleRun;
};

export default useThrottle;
