import { useEffect, useMemo, useState } from 'react';
export enum Effect {
  Show = 'SHOW',
  Showing = 'SHOWING',
  Hiding = 'HIDING',
  Hide = 'HIDE',
}
export interface UseSmoothProps {
  value?: boolean;
  delay: number;
}
export const useSmooth = ({ value, delay }: UseSmoothProps) => {
  /* ======   variables   ====== */
  const [effect, setEffect] = useState<Effect>(Effect.Hide);
  const isShow = useMemo(() => effect === Effect.Show, [effect]);
  const isShowing = useMemo(() => effect === Effect.Showing, [effect]);
  const isHiding = useMemo(() => effect === Effect.Hiding, [effect]);
  const isHide = useMemo(() => effect === Effect.Hide, [effect]);
  const isVisible = useMemo(() => Effect.Show === effect || Effect.Showing === effect, [effect]);
  const isOpen = !isHide;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!value && effect === Effect.Hide) return;
    setEffect(value ? Effect.Showing : Effect.Hiding);

    const timer = setTimeout(() => setEffect(value ? Effect.Show : Effect.Hide), delay);

    return () => clearTimeout(timer);
  }, [value]);
  return {
    effect,
    isOpen,
    isShow,
    isShowing,
    isHiding,
    isHide,
    isVisible,
  };
};
