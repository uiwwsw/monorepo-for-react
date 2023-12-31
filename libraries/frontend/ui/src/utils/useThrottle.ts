import { createLogger } from '@package-frontend/utils';
import { useRef } from 'react';

const logger = createLogger('utils/useThrottle');
const useThrottle = <T>(fn?: (e: T) => unknown, delay: number = 300) => {
  if (!fn) return () => null;
  const sto = useRef<NodeJS.Timeout | null>();
  const handleRun = (e: T) => {
    if (!sto.current) {
      sto.current = setTimeout(async () => {
        logger('handleRun', e);
        sto.current = null;
        return await fn(e);
      }, delay);
    }
  };

  return handleRun;
};

export default useThrottle;
