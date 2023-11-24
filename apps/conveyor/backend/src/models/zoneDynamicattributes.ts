export interface IZoneDynamicattributes {
    ZoneID: number;
    State: number;
    PrevState: number;
    MotorState: number;
    E84JobID?: number;
    E84State?: number;
    E84Sequence?: number;
    E84BitState?: string;
    AirShowerBitState?: string;
}
