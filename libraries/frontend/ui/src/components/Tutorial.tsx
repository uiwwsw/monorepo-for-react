import { createLogger } from '@package-frontend/utils';
import { ReactNode, RefObject, createRef, useEffect, useMemo, useState } from 'react';
import Portal from '@/Portal';
import usePosition from '#/usePosition';
import Button from '@/Button';
import SmoothWrap from './Smooth/Wrap';
/* ======   interface   ====== */
export interface TutorialProps {
  onFinish?: (text?: string) => void;
  btnName?: string;
  guide: {
    delay?: number;
    ref: RefObject<HTMLElement>;
    button?: ReactNode;
    text: string;
    zIndex?: number;
  }[];
}
/* ======    global     ====== */
const logger = createLogger('components/Tutorial');
const Tutorial = ({ guide, btnName = '확인', onFinish }: TutorialProps) => {
  /* ======   variables   ====== */
  const step = guide.find((x) => x.ref.current);
  const [visible, setVisible] = useState(false);
  const text = useMemo(() => step?.text, [step]);
  const button = useMemo(() => step?.button, [step]);
  const delay = useMemo(() => step?.delay, [step]);
  const ref = useMemo(() => step?.ref || createRef<HTMLElement>(), [step]);

  const zIndex = useMemo(() => step?.zIndex, [step]);

  const { position, trigger, size } = usePosition({ targetRef: ref, withSize: true });
  /* ======   function    ====== */
  const setStyle = () => {
    if (ref.current) {
      ref.current.tabIndex = 0;
      ref.current.focus();
      logger('setStyle');
    }
  };
  const handleClick = async () => {
    onFinish && onFinish(text);
    logger('handleClick');
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (ref.current) {
      setTimeout(() => {
        setVisible(true);
        setStyle();
        trigger();
      }, delay);
    }
    logger('useEffect');
    return () => setVisible(false);
  }, [guide]);
  return guide.length ? (
    <Portal>
      <SmoothWrap value={visible} className="tutorial">
        <div
          className="fixed inset-0 overflow-hidden cursor-not-allowed"
          style={{
            zIndex: zIndex ?? 50,
          }}
        >
          <i className="absolute" style={{ ...size, ...position, boxShadow: '0 0 0 10000px rgba(0, 0, 0, 0.7)' }} />
          <i className="absolute animate-ping border-2 border-purple-100" style={{ ...size, ...position }} />
          <div
            className="absolute z-50 p-1"
            style={{
              ...position,

              marginLeft: `${position?.left === 'initial' || position?.left === undefined ? 0 : size?.width}`,
              marginRight: `${position?.right === 'initial' || position?.right === undefined ? 0 : size?.width}`,
            }}
          >
            <div className="cursor-auto bg-purple-400 p-4 rounded-lg">
              <p className="whitespace-pre-line">{text}</p>
              <br />
              <div className="flex gap-2">
                {button}
                <Button onClick={handleClick}>{btnName}</Button>
              </div>
            </div>
          </div>
        </div>
      </SmoothWrap>
    </Portal>
  ) : null;
};

export default Tutorial;
