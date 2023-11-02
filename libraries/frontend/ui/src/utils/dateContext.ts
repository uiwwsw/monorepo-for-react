import { createContext, useContext } from 'react';

interface ContextProps {
  test: boolean;
}
const DateContext = createContext<ContextProps>({
  test: false,
});
export const useDateContext = () => useContext(DateContext);

export default DateContext;
