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
  onFinished?: (value: boolean) => unknown;
  ref: RefObject<HTMLElement>;
}
/* ======    global     ====== */
const useSmooth = ({ value, delay, onFinished, ref }: UseSmoothProps) => {
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
      onFinished && onFinished(value!);
    }, delay);

    return () => clearTimeout(timer);
  }, [value]);
};

export default useSmooth;
