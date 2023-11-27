import { useEffect, useRef, useState } from 'react';
import useDebouce from '#/useDebounce';

const useInfiniteScroll = () => {
  const heightRef = useRef(0);
  const tickRef = useRef(0);
  const scrollYRef = useRef(0);
  const [scrollDeps, setScrollDeps] = useState<number>(0);
  const trigger = async () => {
    heightRef.current = 0;
    tickRef.current = 0;
    scrollYRef.current = 0;
    await setScrollDeps(0);
    window.scrollTo(0, 0);
  };
  const isDocumentEnd = () => {
    const { scrollY, innerHeight } = window;
    const { clientHeight } = document.body;
    if (scrollY + innerHeight >= clientHeight - 50) return true;
    return false;
  };
  const event = () => {
    if (isDocumentEnd()) setScrollDeps(++tickRef.current);
  };
  const onScroll = useDebouce(event, 500);
  useEffect(() => {
    document.addEventListener('scroll', onScroll);

    return () => document.removeEventListener('scroll', onScroll);
  }, []);
  return {
    scrollDeps,
    trigger,
  };
};

export default useInfiniteScroll;
