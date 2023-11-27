import { LazyExoticComponent, lazy } from 'react';

const Control = lazy(() => import('src/pages/Control/Page'));
const SignUp = lazy(() => import('src/pages/SignUp'));
const SignIn = lazy(() => import('src/pages/SignIn'));
const Stats = lazy(() => import('src/pages/Stats/Page'));
const StatsSummary = lazy(() => import('src/pages/Stats/Summary/Page'));
const StatsAlarm = lazy(() => import('src/pages/Stats/Alarm/Page'));
const StatsCarrier = lazy(() => import('src/pages/Stats/Carrier/Page'));
const Help = lazy(() => import('src/pages/Help'));
const Users = lazy(() => import('src/pages/Users/Page'));
const UpdatePassword = lazy(() => import('src/pages/UpdatePassword'));
export interface Group {
  name: string;
  path: string;
  node: LazyExoticComponent<() => JSX.Element>;
}
export interface Tab extends Group {
  icon: string;
  group?: Group[];
}

export const authRoutes: Tab[] = [
  {
    icon: '🔩',
    path: '/control',
    name: '조작',
    node: Control,
    // group: [{ path: '/control/control', name: '조작', node: Control }],
  },
  {
    icon: '🧮',
    name: '통계',
    path: '/stats',
    node: Stats,
    group: [
      { path: '/stats/summary', name: 'SUMMARY', node: StatsSummary },
      { path: '/stats/alarm', name: 'ALARM', node: StatsAlarm },
      { path: '/stats/carrier', name: 'CARRIER', node: StatsCarrier },
    ],
  },
  {
    icon: '👥',
    path: '/users',
    name: '유저관리',
    node: Users,
  },
  {
    icon: '🔏',
    path: '/success-update-password',
    name: '비밀번호변경',
    node: UpdatePassword,
  },
];
export const commonRoutes: Tab[] = [
  {
    icon: '🔐',
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
