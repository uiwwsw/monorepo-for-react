import { createLogger } from '@package-frontend/utils';
import Portal from '@/Portal';
import { MouseEvent, ReactNode, useMemo, useRef, useState } from 'react';
import Smooth from '@/Smooth';
import Button from '@/Button';
import { usePosition } from '#/usePosition';

/* ======   interface   ====== */
export interface MenuProps {
  width?: number;
  children?: ReactNode;
  button?: ReactNode;
  onFinished?: (value: boolean) => unknown;
  isBodyClickClose?: boolean;
}
/* ======    global     ====== */
const logger = createLogger('components/Menu');
const wrapClassName = `inline-block`;
const contentClassName = `z-20 absolute [&[data-position="top"]]:translate-y-14 [&[data-position="bottom"]]:-translate-y-14 [&>*]:w-full`;
const Menu = ({
  button = (
    <Button themeSize="xl" className="w-full">
      매뉴
    </Button>
  ),
  isBodyClickClose = true,
  children,
  width = 200,
  onFinished,
}: MenuProps) => {
  /* ======   variables   ====== */
  const widthStyle = useMemo(() => (width ? width + 'px' : 'initial'), [width]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { setPosition, position } = usePosition({ targetRef: wrapRef });

  /* ======   function    ====== */
  const handleOpen = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    setPosition();
  };
  const handleClose = () => {
    setOpen(false);
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div onClick={handleClose} className={wrapClassName} ref={wrapRef} style={{ width: widthStyle }}>
      <span onClick={handleOpen}>{button}</span>
      <Portal>
        <Smooth
          value={open}
          onFinished={onFinished}
          className={contentClassName}
          data-position={position?.bottom === 'initial' ? 'top' : 'bottom'}
          style={{ ...position, width: widthStyle }}
        >
          {children}
        </Smooth>
        {isBodyClickClose && open && <i className="fixed top-0 left-0 w-full h-full" />}
      </Portal>
    </div>
  );
};
export default Menu;
