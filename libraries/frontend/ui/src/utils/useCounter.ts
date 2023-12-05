import { createLogger } from '@package-frontend/utils';
import { useEffect, useState } from 'react';

const logger = createLogger('utils/useCounter');
const useCounter = (limit: number, step: number = 1) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    logger(`useEffect`);

    const sti = setInterval(() => {
      if (limit <= tick) return () => clearInterval(sti);
      logger(`useEffect: tick/limit = ${tick}/${limit}`);
      setTick(tick + step);
      logger(`${tick}/${limit}`);
    }, 1000);
    return () => clearInterval(sti);
  }, [tick]);
  return {
    increase: tick,
    decrease: limit - tick,
    done: limit <= tick,
  };
};

export default useCounter;
