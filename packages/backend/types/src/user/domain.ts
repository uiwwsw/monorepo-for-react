import { UserGrade, ClientType } from './user_enum';
import { IUserRow } from '../data';


// 사용자 로그인 요청
export interface SignInRequest {
  user_id: string;
  password: string;
  client_type?: ClientType;
}
// 사용자 로그인 응답
export interface SignInResponse {
  uid : number;
  username : string;
  grade: UserGrade;
  token: string;      // JWT 인증 토큰
  last_access: Date;
}


// 사용자 로그아웃 요청
export interface SignOutRequest {
}
// 사용자 로그아웃 응답
export interface SignOutResponse {
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
  users: IUserRow[];
}


// 사용자 정보 수정 요청
export interface UserEditGradeRequest {
  user_id : string;
  grade: UserGrade;
}
// 사용자 정보 수정 응답
export interface UserEditGradeResponse {
  next : UserGrade
}


// 새로운 패스워드 설정 요청
export interface UserPasswordRequest {
  password: string;
}
// 새로운 패스워드 설정 응답
export interface UserPasswordResponse {
}


// Heartbeat 요청
export interface HeartBeatRequest {
}
// Heartbeat 응답
export interface HeartBeatResponse {
  server_time: Date;
}
