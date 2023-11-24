import { UserGrade } from './grade';

export interface UserSession {
    uid: number;
    user_id: string;
    grade: UserGrade;
    key : string;
}
