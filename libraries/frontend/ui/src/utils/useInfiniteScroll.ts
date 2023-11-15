import { useEffect, useRef, useState } from 'react';
import useDebounce from './useDebounce';

const useInfiniteScroll = () => {
  const heightRef = useRef(0);
  const tickRef = useRef(0);
  const scrollYRef = useRef(0);
  const [scrollDeps, setScrollDeps] = useState<number>(0);
  const isDocumentEnd = () => {
    const { scrollY, innerHeight } = window;
    const { clientHeight } = document.body;
    const isDownWheel = scrollY > scrollYRef.current;
    if (scrollY + innerHeight >= clientHeight - 50 && heightRef.current !== clientHeight && isDownWheel) {
      heightRef.current = clientHeight;
      scrollYRef.current = scrollY;
      return true;
    }
    document.removeEventListener('scroll', onScroll);
    return false;
  };
  const event = () => {
    if (!isDocumentEnd()) return false;
    setScrollDeps(++tickRef.current);
    return true;
  };
  const onScroll = useDebounce(event, 500);
  useEffect(() => {
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, []);
  return scrollDeps;
};

export default useInfiniteScroll;
