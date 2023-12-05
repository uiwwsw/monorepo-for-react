import { ROUTES_PATH } from '!/routes/domain';
import { LazyExoticComponent, lazy } from 'react';

const Control = lazy(() => import('src/pages/OldControl/Page'));
// const Control = lazy(() => import('src/pages/Control/Page'));
const SignUp = lazy(() => import('src/pages/SignUp'));
const SignIn = lazy(() => import('src/pages/SignIn'));
const Stats = lazy(() => import('src/pages/Stats/Page'));
const StatsSummary = lazy(() => import('src/pages/Stats/Summary/Page'));
const StatsAlarm = lazy(() => import('src/pages/Stats/Alarm/Page'));
const StatsCarrier = lazy(() => import('src/pages/Stats/Carrier/Page'));
const Help = lazy(() => import('src/pages/Help'));
const Setting = lazy(() => import('src/pages/Setting'));
const Users = lazy(() => import('src/pages/Users/Page'));
const UpdatePassword = lazy(() => import('src/pages/UpdatePassword'));
export interface Group {
  name: string;
  path: ROUTES_PATH;
  node: LazyExoticComponent<() => JSX.Element>;
}
export interface Tab extends Group {
  icon: string;
  group?: Group[];
}

export const authRoutes: Tab[] = [
  {
    icon: '🔩',
    path: ROUTES_PATH['/control'],
    name: '조작',
    node: Control,
    // group: [{ path: '/control/control', name: '조작', node: Control }],
  },
  {
    icon: '🧮',
    name: '통계',
    path: ROUTES_PATH['/stats'],
    node: Stats,
    group: [
      { path: ROUTES_PATH['/stats/summary'], name: '요약', node: StatsSummary },
      { path: ROUTES_PATH['/stats/alarm'], name: '알람', node: StatsAlarm },
      { path: ROUTES_PATH['/stats/carrier'], name: '케리어', node: StatsCarrier },
    ],
  },
  {
    icon: '👥',
    path: ROUTES_PATH['/users'],
    name: '유저관리',
    node: Users,
  },
  {
    icon: '🔏',
    path: ROUTES_PATH['/update-password'],
    name: '비밀번호변경',
    node: UpdatePassword,
  },
];
export const commonRoutes: Tab[] = [
  {
    icon: '🔐',
    path: ROUTES_PATH['/sign-up'],
    name: '회원가입',
    node: SignUp,
  },
  {
    icon: '🗝️',
    path: ROUTES_PATH['/sign-in'],
    name: '로그인',
    node: SignIn,
  },
  {
    icon: '⚙️',
    path: ROUTES_PATH['/setting'],
    name: '설정',
    node: Setting,
  },
  {
    icon: '💊',
    path: ROUTES_PATH['/help'],
    name: '도움말',
    node: Help,
  },
];
