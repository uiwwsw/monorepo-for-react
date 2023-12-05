import { createContext, useContext } from 'react';

interface ContextProps {
  data?: any;
}
const DataContext = createContext<ContextProps>({
  data: undefined,
});
export const useDataContext = () => useContext(DataContext);

export default DataContext;
