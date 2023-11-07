export interface SignInRequest {
  user_id: string;
  password: string;
}

export interface SignInResponse {
  uid : number;
  username : string;
  grade: number;
  session: string;
  last_access: Date;
}
