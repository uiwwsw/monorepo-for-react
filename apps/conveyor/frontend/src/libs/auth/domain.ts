import { IUserRow, SignInResponse, UserGrade } from '@package-backend/types';
import { FORMAT, newDate } from '@package-frontend/utils';
import { t } from 'src/i18n';

export class Auth {
  uid: number;
  userName: string;
  grade: UserGrade;
  token: string;
  lastAccess: string;
  constructor({ uid, username, grade, token, last_access }: SignInResponse) {
    this.uid = uid;
    this.userName = username;
    this.grade = grade;
    this.token = token;
    this.lastAccess = last_access ? newDate(last_access).format(FORMAT) : '';
  }
}
export class User {
  uid?: number;
  userId?: string;
  userName?: string;
  grade?: UserGrade;
  gradeName?: string;
  createdDate: string;
  lastAccess: string;
  constructor({ uid, user_id, user_name, grade, created_date, last_access }: IUserRow) {
    this.uid = uid;
    this.userId = user_id;
    this.userName = user_name;
    this.grade = grade;
    this.gradeName = grade ? UserGrade[grade] : 'unknown';
    this.createdDate = created_date ? newDate(created_date).format(FORMAT) : '';
    this.lastAccess = last_access ? newDate(last_access).format(FORMAT) : '';
  }
}
export type TheadUsers = keyof User;

export const theadUsers: TheadUsers[] = ['uid', 'userId', 'userName', 'gradeName', 'createdDate', 'lastAccess'];
export const fixHeadUsers: Partial<Record<TheadUsers, string>> = {
  uid: t('유니크 아이디'),
  userId: t('유저 아이디'),
  userName: t('유저 이름'),
  gradeName: t('등급'),
  createdDate: t('생성일'),
  lastAccess: t('최근 접속일'),
};
export const mustHaveColumnUsers: (TheadUsers | 'expander')[] = ['uid', 'expander'];
export const columnUsersDisabled = mustHaveColumnUsers.reduce(
  (a, v) => ({ ...a, [v]: true }),
  {} as Partial<Record<TheadUsers, boolean>>,
);
