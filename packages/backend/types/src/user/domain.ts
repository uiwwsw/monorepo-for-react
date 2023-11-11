import { UserGrade } from './grade';
import { IUser } from '../data';

// 사용자 로그인 요청
export interface SignInRequest {
  user_id: string;
  password: string;
}
// 사용자 로그인 응답
export interface SignInResponse {
  uid : number;
  username : string;
  grade: UserGrade;
  token: string;      // JWT 인증 토큰
  last_access: Date;
}

// 사용자 회원가입 요청
export interface SignUpRequest {
  user_id: string;
  username: string;
  password: string;
}
// 사용자 회원가입 응답
export interface SignUpResponse {
  grade: UserGrade;
}

// 사용자 목록 요청
export interface UserListRequest {
}
export interface UserListResponse {
  users: IUser[];
}
