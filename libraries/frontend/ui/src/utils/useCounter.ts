import { useEffect, useRef, useState } from 'react';

const useCounter = (limit: number, step: number = 1) => {
  const sti = useRef<NodeJS.Timeout>();
  const [tick, setTick] = useState<number>(0);
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (!start || tick !== 0) return;
    sti.current = setInterval(() => {
      if (limit <= tick) return () => clearInterval(sti.current);
      setTick((prev) => prev + step);
    }, 1000);
  }, [start, tick]);
  useEffect(() => {
    if (limit - 1 <= tick) return () => clearInterval(sti.current);
  }, [tick]);
  useEffect(() => {
    return () => clearInterval(sti.current);
  }, []);
  return {
    onStart: () => {
      setTick(0);
      setStart(true);
    },
    increase: tick,
    decrease: limit - tick,
    done: limit <= tick,
  };
};

export default useCounter;
