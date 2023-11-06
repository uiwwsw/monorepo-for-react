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
    name: '조작',
    node: Control,
  },
  {
    icon: '🧮',
    path: 'stats',
    name: '통계',
    node: Stats,
  },
];
export const commonRoutes: ParentTab[] = [
  {
    icon: '🗝️',
    path: 'sign-up',
    name: '회원가입',
    node: SignUp,
  },
  {
    icon: '🔓',
    path: 'sign-in',
    name: '로그인',
    node: SignIn,
  },
  {
    icon: '💊',
    path: 'help',
    name: '도움말',
    node: Help,
  },
];
