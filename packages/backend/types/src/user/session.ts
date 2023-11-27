import { UserGrade } from './grade';

export interface UserSession {
    uid: number;
    user_id: string;
    grade: UserGrade;
    client_type : number;
    key : string;
}
