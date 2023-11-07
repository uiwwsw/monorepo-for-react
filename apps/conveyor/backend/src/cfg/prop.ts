export interface Prop {
    PortNum : number;
    MySQL : MySQL;
}

export interface MySQL {
    Host : string;
    Port : number;
    User : string;
    Password : string;
    Database : string;
}