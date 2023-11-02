import { Effect } from '#/useSmooth';
import { createContext, useContext } from 'react';
interface ContextProps {
  effect: Effect;
  isOpen: boolean;
  isVisible: boolean;
  isShow: boolean;
  isShowing: boolean;
  isHiding: boolean;
  isHide: boolean;
}
const SmoothContext = createContext<ContextProps>({
  effect: Effect.Hide,
  isOpen: false,
  isVisible: false,
  isShow: false,
  isShowing: false,
  isHiding: false,
  isHide: false,
});
export const useSmoothContext = () => useContext(SmoothContext);
export default SmoothContext;
