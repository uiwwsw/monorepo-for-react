import { createLogger } from '@package-frontend/utils';
import { ImgHTMLAttributes, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Skeleton from './Skeleton';
import Smooth from './Smooth';

/* ======   interface   ====== */
export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  block?: boolean;
}
/* ======    global     ====== */
const logger = createLogger('components/Image');

const Image = ({ width, height, block, ...props }: ImageProps) => {
  /* ======   variables   ====== */
  const stoRef = useRef<NodeJS.Timeout>();
  const full = width === '100%';
  const [load, setLoad] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState(false);
  const complete = useMemo(() => load || error, [load, error]);
  /* ======   function    ====== */
  const handleLazyLoad = (value?: boolean) => {
    clearTimeout(stoRef.current);
    if (value) setLoad(value);
    else stoRef.current = setTimeout(() => setLoad(value), 100);
  };
  const handleLoad = () => handleLazyLoad(true);
  const handleError = () => setError(true);
  /* ======   useEffect   ====== */
  useLayoutEffect(() => {
    load === undefined && handleLazyLoad(false);
  }, []);
  logger('render');
  return (
    <div className={block || full ? 'flex items-center justify-center' : 'inline-flex'}>
      <div
        className={`inline-flex relative${full ? ' !w-full' : ''}`}
        style={{ width: !complete ? width : 'initial', height: !complete ? height : 'initial' }}
      >
        <Smooth value={load === false} className="absolute w-full h-full">
          <Skeleton className="w-full h-full">
            <i className="w-full h-full" />
          </Skeleton>
        </Smooth>
        <Smooth value={error} className="absolute w-full h-full bg-red-200 items-center flex justify-evenly">
          not found
        </Smooth>
        <img
          {...props}
          width={width}
          onError={handleError}
          onLoad={handleLoad}
          style={{ height: height }}
          className={`${full ? 'w-full' : ''}${load === false ? 'invisible' : 'visible'}`}
        />
      </div>
    </div>
  );
};

export default Image;
