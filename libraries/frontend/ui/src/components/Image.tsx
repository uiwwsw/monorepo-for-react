import { createLogger } from '@package-frontend/utils';
import { ImgHTMLAttributes, useMemo, useState } from 'react';
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
  const full = width === '100%';
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const complete = useMemo(() => load || error, [load, error]);
  /* ======   function    ====== */
  const handleLoad = () => setLoad(true);
  const handleError = () => setError(true);
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className={block || full ? 'flex items-center justify-center' : 'inline-flex'}>
      <div
        className={`inline-flex relative${full ? ' !w-full' : ''}`}
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
          className={`${full ? 'w-full ' : ''}${load ? 'visible' : 'invisible'}`}
        />
      </div>
    </div>
  );
};

export default Image;
