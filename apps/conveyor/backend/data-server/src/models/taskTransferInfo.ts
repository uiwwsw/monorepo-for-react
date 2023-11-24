export interface ITaskTransferInfo {
    TaskID: number;
    ZoneIDCurrent?: number;
    ZoneIDFrom?: number;
    ZoneIDTo?: number;
    CommandID?: string;
    CarrierID?: string;
    State?: string;
    ZoneIDJunctions?: unknown;
    UseZoneIDJunctions?: unknown;
}
