import { Color } from '../components/Color';
import { Size } from '../components/Size';

export interface WithId<T = string> {
  id: T;
}
export interface WithTheme {
  themeColor?: Color;
  themeSize?: Size;
}
