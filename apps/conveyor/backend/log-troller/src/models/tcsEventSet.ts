export interface ITcsEventSet {
    TaskID: number;
    Destination?: string[];
    CommandID?: string;
    CarrierID?: string;
    Time: string;
    SerialNo: number;
    EventCode: string;
    Location: number;
    Reason: string;
}
