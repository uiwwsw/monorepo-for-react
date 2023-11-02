import Caret from '$/Caret';
import Underbar from '$/Underbar';
import { createLogger } from '@package-frontend/utils';
import { ReactNode, useRef, useState } from 'react';
/* ======   interface   ====== */
export interface AccordionProps {
  children: ReactNode;
  title: string;
}
/* ======    global     ====== */
const logger = createLogger('components/Accordion');
const inputClassName = 'pointer-events-none p-3 outline-none w-full h-full text-left';
const Accordion = ({ children, title }: AccordionProps) => {
  /* ======   variables   ====== */
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const onToggle = () => {
    if (height === 0) {
      contentRef?.current && (contentRef.current.dataset.active = 'true');
      setHeight(contentRef?.current?.clientHeight || 50);
    } else {
      contentRef?.current && (contentRef.current.dataset.active = 'false');
      setHeight(0);
    }
  };
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <div className="flex relative" onClick={onToggle}>
        <input role="button" type="button" className={inputClassName} value={title} readOnly />
        <Caret active={!!height} />
        <Underbar active={!!height} />
      </div>
      <div role="article" style={{ height }} className="transition-all overflow-hidden bg-slate-200">
        <div className="p-3" role="contentinfo" ref={contentRef} data-active="false">
          {children}
        </div>
      </div>
    </>
  );
};

export default Accordion;
