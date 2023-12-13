import { useEffect, useRef, useState } from 'react';

const useCounter = (limit: number, step: number = 1) => {
  const sti = useRef<NodeJS.Timeout>();
  const [tick, setTick] = useState(0);
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (!start) return;
    sti.current = setInterval(() => {
      if (limit <= tick) return () => clearInterval(sti.current);
      setTick((prev) => prev + step);
    }, 1000);
    return () => clearInterval(sti.current);
  }, [start]);
  useEffect(() => {
    if (limit - 1 <= tick) return () => clearInterval(sti.current);
  }, [tick]);
  return {
    onStart: () => setStart(true),
    increase: tick,
    decrease: limit - tick,
    done: limit <= tick,
  };
};

export default useCounter;
