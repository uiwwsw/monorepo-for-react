import { Storage, createLogger } from '@package-frontend/utils';
import { ReactNode, RefObject, createRef, useEffect, useMemo, useState } from 'react';
import Portal from './Portal';
import usePosition from '#/usePosition';
import Button from './Button';
import Smooth from './Smooth';
/* ======   interface   ====== */
export interface TutorialProps {
  btnName?: string;
  guide: {
    ref?: RefObject<HTMLElement>;
    button?: ReactNode;
    position?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    size?: {
      width: string;
      height: string;
    };
    text: string;
    zIndex?: number;
  }[];
}
/* ======    global     ====== */
export const tutorialStorage = new Storage<string>(localStorage);
const logger = createLogger('components/Tutorial');
const Tutorial = ({ guide, btnName = '확인' }: TutorialProps) => {
  /* ======   variables   ====== */
  const id = useMemo(() => 'tutorial-' + JSON.stringify(guide.map((x) => x.text).join('/')), [guide]);
  const didSee = typeof tutorialStorage.get(id) === 'string';
  const [finish, setFinish] = useState(false);
  const [done, setDone] = useState(didSee);
  const [step, setStep] = useState(0);
  const text = useMemo(() => guide[step]?.text ?? null, [step, guide]);
  const button = useMemo(() => guide[step]?.button ?? null, [step, guide]);
  const ref = useMemo(() => guide[step]?.ref || createRef<HTMLElement>(), [step, guide]);

  const zIndex = useMemo(() => guide[step]?.zIndex ?? null, [step, guide]);

  const { position: refPosition, trigger, size: refSize } = usePosition({ targetRef: ref, withSize: true });
  const position = useMemo(() => guide[step]?.position ?? refPosition, [step, guide, refPosition]);
  const size = useMemo(() => guide[step]?.size ?? refSize, [step, guide, refSize]);
  /* ======   function    ====== */
  const setStyle = () => {
    if (ref.current) {
      ref.current.tabIndex = 0;
      ref.current.focus();
      logger('setStyle');
    }
  };
  const handleClick = async () => {
    const nextStep = step + 1;
    if (nextStep < guide.length) setStep(step + 1);
    else {
      setDone(true);
      tutorialStorage.set(id, new Date().toISOString());
    }
    logger('handleClick');
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (didSee) return;
    setStyle();
    trigger();
    logger('useEffect');
  }, [step]);

  return !didSee ? (
    <Portal>
      {!finish && (
        <Smooth value={!done} onFinished={(value) => setFinish(!value)} className="tutorial">
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
        </Smooth>
      )}
    </Portal>
  ) : null;
};

export default Tutorial;
