import { RefObject, useState } from 'react';
import { createLogger, getScrollbarWidth } from '@package-frontend/utils';
/* ======   interface   ====== */

export interface UsePositionProps {
  targetRef: RefObject<HTMLElement>;
  withSize?: boolean;
}
/* ======    global     ====== */
const logger = createLogger('utils/useDebounce');

const usePosition = ({ targetRef, withSize }: UsePositionProps) => {
  /* ======   variables   ====== */
  const [size, setSize] = useState<{
    width?: string;
    height?: string;
  }>();
  const [position, setPosition] = useState<{
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  }>();
  /* ======   function    ====== */
  const trigger = () => {
    const targetRefRect = targetRef.current?.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { scrollX, scrollY } = window;
    const scrollbarWidth = getScrollbarWidth();

    let top, left, bottom, right;

    if (targetRefRect) {
      if (targetRefRect.left + targetRefRect.width / 2 < windowWidth / 2) {
        left = targetRefRect.left + scrollX; // 툴팁을 요소의 오른쪽에 위치시킴
      } else {
        right = windowWidth - targetRefRect.right - scrollX - scrollbarWidth; // 툴팁을 요소의 왼쪽에 위치시킴
      }

      // 화면의 상단과 하단을 기준으로 툴팁 위치 결정
      if (targetRefRect.top + targetRefRect.height / 2 < windowHeight / 2) {
        top = targetRefRect.top + scrollY; // 툴팁을 요소의 아래쪽에 위치시킴
      } else {
        bottom = windowHeight - targetRefRect.bottom - scrollY; // 툴팁을 요소의 위쪽에 위치시킴
      }
    }
    withSize &&
      setSize({
        width: targetRefRect?.width ? `${targetRefRect?.width}px` : 'initial',
        height: targetRefRect?.height ? `${targetRefRect?.height}px` : 'initial',
      });
    setPosition({
      top: top !== undefined ? `${top}px` : 'initial',
      left: left !== undefined ? `${left}px` : 'initial',
      bottom: bottom !== undefined ? `${bottom}px` : 'initial',
      right: right !== undefined ? `${right}px` : 'initial',
    });
    logger('trigger', top, left, bottom, right, targetRefRect);
  };
  /* ======   useEffect   ====== */

  return { trigger, position, size };
};

export default usePosition;
