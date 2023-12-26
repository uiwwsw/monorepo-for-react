export interface Prop {
    PortNum : number;
    MySQL : MySQL;
    Redis : Redis;
    JWT : JWT;
}

export interface MySQL {
    Host : string;
    Port : number;
    User : string;
    Password : string;
    Database : string;
}

export interface Redis {
    Host : string;
    Port : number;
}

export interface JWT {
    Secret : string;
    ExpiresIn : string;
}