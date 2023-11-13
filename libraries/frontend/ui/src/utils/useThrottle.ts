import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';

const logger = createLogger('utils/useThrottle');
const useThrottle = <T>(fn?: (e: T) => unknown, delay: number = 300) => {
  if (!fn) return () => null;
  const [isThrottling, setIsThrottling] = useState(false);
  const handleRun = (e: T) => {
    logger('이벤트 시도', isThrottling);
    if (isThrottling) return;
    setIsThrottling(true);

    logger('이벤트 실행', e);
    fn(e);
    setTimeout(() => setIsThrottling(false), delay);
  };

  return handleRun;
};

export default useThrottle;
