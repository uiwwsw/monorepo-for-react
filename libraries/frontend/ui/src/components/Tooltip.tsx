import { useState, useRef, ReactNode } from 'react';
import { createLogger } from '@package-frontend/utils';
import Portal from './Portal';
import Smooth from './Smooth';
import { usePosition } from '#/usePosition';

/* ======   interface   ====== */
export interface TooltipProps {
  children?: ReactNode;
}

/* ======    global     ====== */
const logger = createLogger('components/Tooltip');
const Tooltip = ({ children }: TooltipProps) => {
  /* ======   variables   ====== */
  const [visible, setVisible] = useState<boolean>(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { setPosition, position } = usePosition({ targetRef: wrapRef });

  const textClassName = `z-10 absolute bg-white p-5 border-2 rounded-md${visible ? '' : ' pointer-events-none'}`;
  /* ======   function    ====== */
  const showTooltip = () => {
    logger('Show Tooltip');
    setVisible(true);
    setPosition();
  };

  const hideTooltip = () => {
    logger('Hide Tooltip');
    setVisible(false);
  };

  /* ======   useEffect   ====== */
  // No useEffect in this example, but you can add it if needed.

  logger('render');

  return (
    <div className="inline-block" ref={wrapRef} onMouseLeave={hideTooltip} onMouseEnter={showTooltip}>
      <span className="pointer-events-none block w-6 h-6 leading-6 text-md box-content font-bold rounded-full text-center text-red-600 border-red-600 border-2">
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
