import { Profile, AttributeQS, Zone } from "../zone/zone";


export interface IGetSystemEquipValueReq {
}
export interface IGetSystemEquipValueResp {
    model : string;
    name : string;
    default_model : string;
    transfer_timeout : number
}

export interface ISetSystemEquipValueReq {
    target : string;
    value : string;
}
export interface ISetSystemEquipValueResp {
}


export interface IEquipmentInfoReq {
}
export interface IEquipmentInfoResp {
    model: string;
    name : string
}

export interface IMotionParamInfoReq {
    zone_id : number;
}
export interface IMotionParamInfoResp extends Profile {
}

export interface IEquipmentExInfoReq {
    zone_id : number;
}
export interface IEquipmentExInfoResp {
    OverrideDelay: string;
    DccRatio : string;
    RunCurrent : string;
    StandbyCurrent : string;
    PosPlusHtoP : string;
    PosMinusPtoH : string;
    PosPlusHtoN : string;
    PosMinusNtoH : string;
    PosPlusPtoN : string;
    PosMinusNtoP : string;
    PosPlusOffset : string;
    PosMinusOffset : string;
    QsVel : string;
    QsAcc : string;
    QsDcc : string;
    OffsetVel : string;
    OffsetAcc : string;
    ffsetDcc : string;
}


export interface IOffsetInfoReq {
    zone_id : number;
}
export interface IOffsetInfoResp extends AttributeQS {
}


export interface ICheckTcmClientReq {
    tcm_id : number;
}
export interface TcmClientAlive {
    tcm_id : number;
    alive : number;
}
export interface ICheckTcmClientResp {
    state? : TcmClientAlive[];
    write_log : number;
}


export interface IAttributeLifterPosReq {
    zone_id : string;
    level : number;
    position : number;
}
export interface IAttributeLifterPosResp {
}


export interface IZoneInfoReq {
}
export interface IZoneInfoResp {
    zones : Zone[];
}


export interface IGetUseSmmEmulReq {
}
export interface IGetUseSmmEmulResp {
    use_smm_emul : number;
}


export interface IGetTcmPortReq {
    tcm_id : number;
}
export interface IGetTcmPortResp {
    port : number;
}
