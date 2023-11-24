export interface Auth {
  grade: number;
  lastAccess: string;
  token: string;
  uid: number;
  username: string;
}
export interface User {
  uid: number;
  userId: string;
  userName: string;
  grade: number;
  createdDate: string;
  lastAccess: string;
}
