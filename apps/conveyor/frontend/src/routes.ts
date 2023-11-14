import { LazyExoticComponent, lazy } from 'react';

const Control = lazy(() => import('./pages/Control/Page'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Stats = lazy(() => import('./pages/Stats'));
const Help = lazy(() => import('./pages/Help'));
type Tab = {
  name: string;
  path: string;
  node: LazyExoticComponent<() => JSX.Element>;
};
export type ParentTab = Tab & { group?: Tab[]; icon: string };

export const authRoutes: ParentTab[] = [
  {
    icon: '🖥️',
    path: '/control',
    name: '조작',
    node: Control,
    // group: [{ path: '/control/control', name: '조작', node: Control }],
  },
  {
    icon: '🧮',
    path: '/stats',
    name: '통계',
    node: Stats,
  },
];
export const commonRoutes: ParentTab[] = [
  {
    icon: '🔓',
    path: '/sign-up',
    name: '회원가입',
    node: SignUp,
  },
  {
    icon: '🗝️',
    path: '/sign-in',
    name: '로그인',
    node: SignIn,
  },
  {
    icon: '💊',
    path: '/help',
    name: '도움말',
    node: Help,
  },
];
