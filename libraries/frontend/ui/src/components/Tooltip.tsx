import { useState, useRef, ReactNode, HTMLAttributes } from 'react';
import { createLogger } from '@package-frontend/utils';
import Portal from './Portal';
import Smooth from './Smooth';
import usePosition from '#/usePosition';
import { Size } from './Size';
import { Color } from './Color';

/* ======   interface   ====== */
export interface TooltipProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  themeSize?: Size;
  themeColor?: Color;
}

/* ======    global     ====== */
const colorClass = `
[[data-color='primary']>&]:text-red-600 [[data-color='primary']>&]:border-red-600 
[[data-color='secondary']>&]:text-yellow-600 [[data-color='secondary']>&]:border-yellow-600 
[[data-color='tertiary']>&]:text-gray-600 [[data-color='tertiary']>&]:border-gray-600`;
const sizeClass = `
[[data-size='xl']>&]:w-7 [[data-size='xl']>&]:h-7 [[data-size='xl']>&]:leading-7 [[data-size='xl']>&]:text-xl
[[data-size='md']>&]:w-6 [[data-size='md']>&]:h-6 [[data-size='md']>&]:leading-6 [[data-size='md']>&]:text-md
[[data-size='sm']>&]:w-5 [[data-size='sm']>&]:h-5 [[data-size='sm']>&]:leading-5 [[data-size='sm']>&]:text-sm
[[data-size='xs']>&]:w-4 [[data-size='xs']>&]:h-4 [[data-size='xs']>&]:leading-4 [[data-size='xs']>&]:text-xs
`;
const logger = createLogger('components/Tooltip');
const Tooltip = ({ children, themeSize = 'sm', themeColor = 'tertiary', ...props }: TooltipProps) => {
  /* ======   variables   ====== */
  const [visible, setVisible] = useState<boolean>(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { trigger, position } = usePosition({ targetRef: wrapRef });

  const textClassName = `z-40 absolute bg-white p-5 border-2 rounded-md${visible ? '' : ' pointer-events-none'}`;
  /* ======   function    ====== */
  const showTooltip = () => {
    logger('Show Tooltip');
    setVisible(true);
    trigger();
  };

  const hideTooltip = () => {
    logger('Hide Tooltip');
    setVisible(false);
  };

  /* ======   useEffect   ====== */
  // No useEffect in this example, but you can add it if needed.

  logger('render');

  return (
    <div
      className="inline-block"
      {...props}
      data-color={themeColor}
      data-size={themeSize}
      ref={wrapRef}
      onMouseLeave={hideTooltip}
      onMouseEnter={showTooltip}
    >
      <span
        className={`pointer-events-none block box-content font-bold rounded-full text-center border-2${colorClass}${sizeClass}`}
      >
        ❓
      </span>
      <Portal>
        <Smooth value={visible} className={textClassName} style={position}>
          {children}
        </Smooth>
      </Portal>
    </div>
  );
};

export default Tooltip;
