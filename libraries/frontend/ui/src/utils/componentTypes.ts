import { Color } from '../components/Color';
import { Size } from '../components/Size';

export interface WithEval<T = unknown, R = void> {
  onEval?: (value?: T) => Promise<R> | R;
}
export interface WithId<T = string> {
  id: T;
}
export interface WithTheme {
  themeColor?: Color;
  themeSize?: Size;
}
