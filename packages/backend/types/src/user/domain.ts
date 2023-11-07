export interface SignInRequest {
  user_id: string;
  password: string;
}

export interface SignInResponse {
  grade: string;
  session: string;
}
