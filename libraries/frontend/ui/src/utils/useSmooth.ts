import { RefObject, useEffect } from 'react';
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
  onClosed?: () => unknown;
  ref: RefObject<HTMLElement>;
}
/* ======    global     ====== */
export const useSmooth = ({ value, delay, onClosed, ref }: UseSmoothProps) => {
  /* ======   variables   ====== */
  let effect: Effect;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!ref.current?.dataset.smooth && !value) return;
    effect = value ? Effect.Showing : Effect.Hiding;
    ref.current && (ref.current.dataset.smooth = effect);
    const timer = setTimeout(() => {
      effect = value ? Effect.Show : Effect.Hide;
      ref.current && (ref.current.dataset.smooth = effect);
      onClosed && !value && onClosed();
    }, delay);

    return () => clearTimeout(timer);
  }, [value]);
};
