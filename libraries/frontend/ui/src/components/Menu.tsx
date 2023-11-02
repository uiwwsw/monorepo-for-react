import { createLogger } from '@package-frontend/utils';
import Portal from '@/Portal';
import { ReactNode, useMemo, useRef, useState } from 'react';
import Smooth from '@/Smooth';
import Button from '@/Button';
import { usePosition } from '#/usePosition';

/* ======   interface   ====== */
export interface MenuProps {
  width?: number;
  children?: ReactNode;
  button?: ReactNode;
}
/* ======    global     ====== */
const logger = createLogger('components/Menu');
const wrapClassName = `inline-block`;
const contentClassName = `absolute [&[data-position="top"]]:translate-y-14 [&[data-position="bottom"]]:-translate-y-14 [&>*]:w-full`;
const Menu = ({
  button = (
    <Button themeSize="xl" className="w-full">
      매뉴
    </Button>
  ),
  children,
  width = 200,
}: MenuProps) => {
  /* ======   variables   ====== */
  const widthStyle = useMemo(() => (width ? width + 'px' : 'initial'), [width]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { setPosition, position } = usePosition({ targetRef: wrapRef });

  /* ======   function    ====== */
  const handleToggle = () => {
    if (!open) setPosition();
    setOpen(!open);
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div onClick={handleToggle} className={wrapClassName} ref={wrapRef} style={{ width: widthStyle }}>
      {button}
      <Portal>
        <Smooth
          value={open}
          className={contentClassName}
          data-position={position?.bottom === 'initial' ? 'top' : 'bottom'}
          style={{ ...position, width: widthStyle }}
        >
          {children}
        </Smooth>
      </Portal>
    </div>
  );
};
export default Menu;
