import { RefObject, useState } from 'react';
/* ======   interface   ====== */
export interface UsePositionProps {
  targetRef: RefObject<HTMLElement>;
}
/* ======    global     ====== */
const getScrollbarWidth = () => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
};
const usePosition = ({ targetRef }: UsePositionProps) => {
  /* ======   variables   ====== */
  const [position, _setPosition] = useState<{
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  }>();
  /* ======   function    ====== */
  const setPosition = () => {
    const targetRefRect = targetRef.current?.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { scrollX, scrollY } = window;
    const scrollbarWidth = document.body.scrollHeight > window.innerHeight ? getScrollbarWidth() : 0;

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
    _setPosition({
      top: top !== undefined ? `${top}px` : 'initial',
      left: left !== undefined ? `${left}px` : 'initial',
      bottom: bottom !== undefined ? `${bottom}px` : 'initial',
      right: right !== undefined ? `${right}px` : 'initial',
    });
  };
  /* ======   useEffect   ====== */

  return { setPosition, position };
};

export default usePosition;
