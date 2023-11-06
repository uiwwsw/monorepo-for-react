import Control from './pages/Control';
import SignUp from './pages/SignUp';
import Stats from './pages/Stats';
type Tab = {
  name: string;
  path: string;
};
type ParentTab = Tab & { group?: Tab[]; icon: string; node: () => JSX.Element };

export const authRoutes: ParentTab[] = [
  {
    icon: '🖥️',
    path: 'control',
    name: 'Control',
    node: Control,
  },
  {
    icon: '🧮',
    path: 'stats',
    name: 'Statistics',
    node: Stats,
  },
];
export const commonRoutes: ParentTab[] = [
  {
    icon: '🗝️',
    path: 'sign-up',
    name: 'SignUp',
    node: SignUp,
  },
];
