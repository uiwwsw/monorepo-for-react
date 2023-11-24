import { SignInResponse } from '@package-backend/types';

export interface Auth extends Omit<SignInResponse, 'last_access'> {
  lastAccess: string;
}
export interface User extends Omit<Auth, 'username'> {
  userId: string;
  userName: Auth['username'];
  createdDate: string;
}
