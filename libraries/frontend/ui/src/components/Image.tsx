import { createLogger } from '@package-frontend/utils';
import { ImgHTMLAttributes, useMemo, useState } from 'react';
import Skeleton from './Skeleton';
import Smooth from './Smooth';
/* ======   interface   ====== */
export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {}
/* ======    global     ====== */
const logger = createLogger('components/Image');
const imageClassName = 'inline-block relative';
const Image = ({ width, height, ...props }: ImageProps) => {
  /* ======   variables   ====== */
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const complete = useMemo(() => load || error, [load, error]);
  /* ======   function    ====== */
  const handleLoad = () => setLoad(true);
  const handleError = () => setError(true);
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div
      className={imageClassName}
      style={{ width: !complete ? width : 'initial', height: !complete ? height : 'initial' }}
    >
      <Smooth value={!load} className="absolute w-full h-full">
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
        height={height}
        onError={handleError}
        onLoad={handleLoad}
        className={load ? 'visible' : 'invisible'}
      />
    </div>
  );
};

export default Image;
