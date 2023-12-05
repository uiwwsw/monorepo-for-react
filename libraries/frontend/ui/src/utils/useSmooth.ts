import { RefObject, useEffect } from 'react';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
export enum Effect {
  Show = 'SHOW',
  Showing = 'SHOWING',
  Hiding = 'HIDING',
  Hide = 'HIDE',
}
export interface UseSmoothProps {
  value?: boolean;
  delay: number;
  onFinished?: (value: boolean) => unknown;
  ref: RefObject<HTMLElement>;
}
/* ======    global     ====== */
const logger = createLogger('utils/useSmooth');
const useSmooth = ({ value, delay, onFinished, ref }: UseSmoothProps) => {
  /* ======   variables   ====== */
  let effect: Effect;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!ref.current?.dataset.smooth && !value) return;
    effect = value ? Effect.Showing : Effect.Hiding;
    ref.current && (ref.current.dataset.smooth = effect);
    logger('useEffect', effect);
    const timer = setTimeout(() => {
      effect = value ? Effect.Show : Effect.Hide;
      logger('useEffect', effect);
      ref.current && (ref.current.dataset.smooth = effect);
      onFinished && onFinished(value!);
    }, delay);

    return () => clearTimeout(timer);
  }, [value]);
};

export default useSmooth;
