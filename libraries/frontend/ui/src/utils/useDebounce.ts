import { createLogger } from '@package-frontend/utils';
import { useRef } from 'react';

const logger = createLogger('utils/useDebounce');
const useDebounce = <T>(fn?: (e: T) => unknown, delay: number = 300) => {
  if (!fn) return () => null;
  const sto = useRef<NodeJS.Timeout>();
  const handleRun = (e: T) => {
    if (sto.current) clearTimeout(sto.current);

    sto.current = setTimeout(async () => {
      logger('handleRun', e);
      return await fn(e);
    }, delay);
  };

  return handleRun;
};

export default useDebounce;
