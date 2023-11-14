import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

const useInfiniteScroll = (fn: () => Promise<unknown>) => {
  const [loading, setLoading] = useState(false);
  const onScroll = useDebounce(async () => {
    const { scrollY, innerHeight } = window;
    const { clientHeight } = document.body;
    if (scrollY + innerHeight >= clientHeight - 50 && !loading) {
      setLoading(true);
      await fn();
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, []);
  return loading;
};

export default useInfiniteScroll;
