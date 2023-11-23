export interface Auth {
  grade: string;
  last_access: string;
  token: string;
  uid: number;
  username: string;
}
export interface User {
  uid: number;
  user_id: string;
  user_name: string;
  grade: number;
  created_date: string;
  last_access: string;
}
