import { RefObject, useEffect, useState } from 'react';
import useDebounce from './useDebounce';

const useInfiniteScroll = (fn: () => Promise<unknown>, ref?: RefObject<HTMLElement>) => {
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
    const element = ref ? ref.current : document;
    element?.addEventListener('scroll', onScroll);
    return () => element?.removeEventListener('scroll', onScroll);
  }, [ref]);
  return loading;
};

export default useInfiniteScroll;
