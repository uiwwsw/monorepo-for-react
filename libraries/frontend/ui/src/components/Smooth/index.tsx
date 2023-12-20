import { RefObject, useEffect } from 'react';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
export enum Effect {
  Show = 'SHOW',
  Showing = 'SHOWING',
  Hiding = 'HIDING',
  Hide = 'HIDE',
}
export interface SmoothProps {
  value?: boolean;
  delay: number;
  onFinished?: (value: boolean) => unknown;
  itemRef?: RefObject<HTMLElement>;
}
/* ======    global     ====== */
const logger = createLogger('components/Smooth');
const Smooth = ({ value, delay, onFinished, itemRef }: SmoothProps) => {
  /* ======   variables   ====== */
  let effect: Effect;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!itemRef) return;
    if (!itemRef.current?.dataset.smooth && !value) return;
    effect = value ? Effect.Showing : Effect.Hiding;
    itemRef.current && (itemRef.current.dataset.smooth = effect);
    logger('useEffect', effect);
    const timer = setTimeout(() => {
      effect = value ? Effect.Show : Effect.Hide;
      logger('useEffect', effect);
      itemRef.current && (itemRef.current.dataset.smooth = effect);
      onFinished && onFinished(value!);
    }, delay);

    return () => clearTimeout(timer);
  }, [value]);
  return null;
};

export default Smooth;
