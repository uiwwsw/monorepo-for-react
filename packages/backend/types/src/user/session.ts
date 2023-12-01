import { UserGrade, ClientType } from './user_enum';

export interface UserSession {
    uid: number;
    user_id: string;
    grade: UserGrade;
    client_type : ClientType;
    key : string;
}
