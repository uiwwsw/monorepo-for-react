import Control from './pages/Control';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Stats from './pages/Stats';
import Help from './pages/Help';
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
  {
    icon: '🔓',
    path: 'sign-in',
    name: 'SignIn',
    node: SignIn,
  },
  {
    icon: '💊',
    path: 'help',
    name: 'Help',
    node: Help,
  },
];
