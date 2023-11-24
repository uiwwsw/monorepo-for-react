export interface IZoneOccupiedAttributes {
    ZoneID: number;
    ReservedTaskID: number;
    Occupied: number;
    OccupiedSensor1?: number;
    OccupiedSensor2?: number;
    OccupiedSensor3?: number;
    OccupiedSensor4?: number;
    OccupiedSensor5?: number;
    OccupiedSensor6?: number;
    CurrentDirection: number;
    CurrentLevel: number;
    AlarmSerialNumber: number;
}
