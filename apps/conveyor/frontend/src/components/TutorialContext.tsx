import { TutorialProps } from '@library-frontend/ui';
import { createContext, useContext } from 'react';

export interface ContextProps {
  guides: TutorialProps['guide'];
  addGuides: (guides: ContextProps['guides']) => void;
  onFinish: (text?: string) => void;
  setGuides: (guides: ContextProps['guides']) => void;
}
const TutorialContext = createContext<ContextProps>({
  guides: [],
  addGuides: () => null,
  onFinish: () => null,
  setGuides: () => null,
});
export const useTutorialContext = () => useContext(TutorialContext);

export default TutorialContext;
