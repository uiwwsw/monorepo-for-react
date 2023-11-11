export interface Prop {
    PortNum : number;
    MySQL : MySQL;
    JWT : JWT;
}

export interface MySQL {
    Host : string;
    Port : number;
    User : string;
    Password : string;
    Database : string;
}

export interface JWT {
    Secret : string;
    ExpiresIn : string;
}