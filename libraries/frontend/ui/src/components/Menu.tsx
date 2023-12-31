import { createLogger } from '@package-frontend/utils';
import Portal from '@/Portal';
import { MouseEvent, ReactNode, useMemo, useRef, useState } from 'react';
import SmoothWrap from '@/Smooth/Wrap';
import Button from '@/Button';
import usePosition from '#/usePosition';

/* ======   interface   ====== */
export interface MenuProps {
  width?: string;
  children?: ReactNode;
  button?: ReactNode;
  onFinished?: (value: boolean) => unknown;
  isBodyClickClose?: boolean;
  className?: string;
  zIndex?: number;
}
/* ======    global     ====== */
const logger = createLogger('components/Menu');
const Menu = ({
  button = (
    <Button themeSize="xl" className="w-full">
      매뉴
    </Button>
  ),
  isBodyClickClose = true,
  children,
  width = '200px',
  className,
  zIndex = 20,
  onFinished,
}: MenuProps) => {
  /* ======   variables   ====== */
  const contentClassName = `absolute [&[data-position="top"]]:translate-y-14 [&[data-position="bottom"]]:-translate-y-14 [&>*]:w-full${
    className ? ` ${className}` : ''
  }`;
  const widthStyle = useMemo(() => (width ? width : 'initial'), [width]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { trigger, position, size } = usePosition({ targetRef: wrapRef, withSize: true });

  /* ======   function    ====== */
  const handleOpen = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    trigger();
    logger('handleOpen');
  };
  const handleClose = () => {
    setOpen(false);
    logger('handleClose');
  };
  /* ======   useEffect   ====== */
  return (
    <div onClick={handleClose} className="inline-flex" ref={wrapRef} style={{ width: widthStyle }}>
      <span className="flex-1" onClick={handleOpen}>
        {button}
      </span>
      <Portal>
        <SmoothWrap
          value={open}
          onFinished={onFinished}
          className={contentClassName}
          data-position={position?.bottom === 'initial' ? 'top' : 'bottom'}
          style={{ ...position, width: size?.width, maxHeight: size?.maxHeight, zIndex }}
        >
          {children}
        </SmoothWrap>
        {isBodyClickClose && open && <i className="fixed top-0 left-0 w-full h-full" style={{ zIndex: zIndex - 1 }} />}
      </Portal>
    </div>
  );
};
export default Menu;
