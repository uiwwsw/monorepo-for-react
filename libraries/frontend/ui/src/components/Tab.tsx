import { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { createLogger } from '@package-frontend/utils';
import { generateRipple } from '#/generateRipple';
/* ======   interface   ====== */
export interface TabProps {
  header: string[];
  activeIndex?: number;
  children?: ReactNode;
  onChange?: (index: number) => void;
}

/* ======    global     ====== */
const logger = createLogger('components/Tab');
const contentClassName = `p-3 border-gray-200 border-b [&>*]:hidden [[data-index="0"]>&>*:nth-child(1)]:block [[data-index="1"]>&>*:nth-child(2)]:block [[data-index="2"]>&>*:nth-child(3)]:block [[data-index="3"]>&>*:nth-child(4)]:block [[data-index="4"]>&>*:nth-child(5)]:block [[data-index="5"]>&>*:nth-child(6)]:block [[data-index="6"]>&>*:nth-child(7)]:block [[data-index="7"]>&>*:nth-child(8)]:block [[data-index="8"]>&>*:nth-child(9)]:block [[data-index="9"]>&>*:nth-child(10)]:block`;
const tabClassName = `relative transition overflow-hidden p-3 flex-1 hover:bg-gray-200 whitespace-pre [[data-index="0"]>span>ul>&:nth-child(1)]:font-bold [[data-index="1"]>span>ul>&:nth-child(2)]:font-bold [[data-index="2"]>span>ul>&:nth-child(3)]:font-bold [[data-index="3"]>span>ul>&:nth-child(4)]:font-bold [[data-index="4"]>span>ul>&:nth-child(5)]:font-bold [[data-index="5"]>span>ul>&:nth-child(6)]:font-bold [[data-index="6"]>span>ul>&:nth-child(7)]:font-bold [[data-index="7"]>span>ul>&:nth-child(8)]:font-bold [[data-index="8"]>span>ul>&:nth-child(9)]:font-bold [[data-index="9"]>span>ul>&:nth-child(10)]:font-bold`;
const Tab = ({ children, header, activeIndex = 0, onChange }: TabProps) => {
  /* ======   variables   ====== */
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLUListElement>(null);
  /* ======   function    ====== */
  const handleTabEvent = (e: MouseEvent, index: number) => {
    if (!containerRef.current) return;
    containerRef.current.dataset.index = `${index}`;
    moveUnderline(index);
    generateRipple(e);
    onChange && onChange(index);
  };
  const moveUnderline = (index: number) => {
    const headerCurrent = headerRef.current?.children[index] as HTMLElement;
    const borderCurrent = borderRef.current;
    if (!headerCurrent || !borderCurrent) return;
    borderCurrent.style.transform = `translateX(${headerCurrent.offsetLeft}px)`;
    borderCurrent.style.width = `${headerCurrent.offsetWidth}px`;
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    moveUnderline(activeIndex);
  }, [activeIndex]);
  logger('render');
  return (
    <div data-index={activeIndex} ref={containerRef}>
      <span className="relative block">
        <ul className="flex border-gray-200 border-b" ref={headerRef}>
          {header.map((x, i) => (
            <li className={tabClassName} role="button" key={x + i} onClick={(e) => handleTabEvent(e, i)}>
              {x}
            </li>
          ))}
        </ul>
        <i ref={borderRef} className="absolute bottom-0 left-0 border-b-2 border-blue-600 transition" />
      </span>
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default Tab;
