import { ReactNode, createContext, useContext } from 'react';

export interface ContextProps {
  children?: ReactNode;
  setChildren: (children?: ReactNode) => void;
}
const HeaderContext = createContext<ContextProps>({
  children: undefined,
  setChildren: () => null,
});
export const useHeaderContext = () => useContext(HeaderContext);

export default HeaderContext;
