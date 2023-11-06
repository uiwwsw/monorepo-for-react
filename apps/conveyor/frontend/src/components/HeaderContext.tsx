import { Auth } from '!/auth/domain';
import { ReactNode, createContext, useContext } from 'react';

interface ContextProps {
  children?: ReactNode;
  auth?: Auth;
  setChildren: (children: ReactNode) => void;
  setAuth: (auth: Auth) => void;
}
const HeaderContext = createContext<ContextProps>({
  children: undefined,
  setChildren: () => null,
  auth: undefined,
  setAuth: () => null,
});
export const useHeaderContext = () => useContext(HeaderContext);

export default HeaderContext;
