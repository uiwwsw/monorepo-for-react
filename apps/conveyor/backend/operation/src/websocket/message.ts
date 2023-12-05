function addZero(x:number, n:number) : string {
    let xStr = x.toString();
    while (xStr.length < n) {
        xStr = `0${x}`;
    }
    return xStr;
}

function currentTimeInMilliseconds() {
    const d = new Date();
    const mo = addZero(d.getMonth() + 1, 2);
    const da = addZero(d.getDate(), 2);
    const h = addZero(d.getHours(), 2);
    const m = addZero(d.getMinutes(), 2);
    const s = addZero(d.getSeconds(), 2);
    const ms = addZero(Math.floor(d.getMilliseconds() / 10), 2);
    return d.getFullYear() + mo + da + h + m + s + ms;
}

export function currentTime() {
    return currentTimeInMilliseconds();
}

export interface msg {
    MessageID: string;
    MessageData: unknown;
}

export enum MessageID {
    TcmMotionCommand = 'tcmMotionCommand',
    UimZoneStateChangeReq = 'uimZoneStateChangeReq',
    UimZoneUserAttributes = 'uimZoneUserAttributes',
    HimForceInstallCarrier = 'himForceInstallCarrier',
    HimChangeCmdReq = 'himChangeCmdReq',
    UimCarrierReInstall = 'uimCarrierReInstall',
    UimControlModule = 'uimControlModule',
    UimEquipmentStateChangeReq = 'uimEquipmentStateChangeReq',
    UimConfigurationSet = 'uimConfigurationSet',
    DcmAirShowerCmd = 'dcmAirShowerCmd',
    UimZoneAirShowerAttributes = 'uimZoneAirShowerAttributes',
    HimControlSignal = 'himControlSignal',
}

export interface TcmMotionCommand {
    BaseTime: string;
    AutoCommand: number;
    TaskID: number;
    ZoneID: number;
    Command: number;
    SpeedType: number;
    Direction: number;
    Position: number;
}

export interface ISysCommand {
    CommnadID: number;
    value: string;
}

export function makeTcmMotionCommand(taskID:number, zoneID:number, commandID:number, speedType:number, direction:number, position:number) {
    const data: TcmMotionCommand = {
        BaseTime: currentTimeInMilliseconds(),
        AutoCommand: 0,
        TaskID: taskID,
        ZoneID: zoneID,
        Command: commandID,
        SpeedType: speedType,
        Direction: direction,
        Position: position,
    };
    const msg: msg = {
        MessageID: MessageID.TcmMotionCommand,
        MessageData: data,
    };

    return JSON.stringify(msg);
}

interface commandInfo {
    CommandID: string;
    Priority: number;
    Replace: number;
}

interface HimTransferReq {
    BaseTime: string;
    CommandSource: string;
    commandInfo: commandInfo;
    TransferInfo: unknown[];
}

interface TransferInfo {
    TaskID: number;
    SourceZoneID: number;
    DestZoneID: number;
    JunctionZoneIDs: number;
}

export function makeHimTransferReq(taskID:number, zoneIDTo:number, junctionZoneIDs:number) {
    const cmdinfo: commandInfo = {
        CommandID: '',
        Priority: 0,
        Replace: 0,
    };

    const data: HimTransferReq = {
        BaseTime: currentTimeInMilliseconds(),
        CommandSource: '',
        commandInfo: cmdinfo,
        TransferInfo:[],
    };

    const transferInfo: TransferInfo = {
        TaskID: taskID,
        SourceZoneID: 0,
        DestZoneID: zoneIDTo,
        JunctionZoneIDs: junctionZoneIDs,
    };

    data.TransferInfo.push(transferInfo);

    const msg: msg = {
        MessageID: 'himTransferReq',
        MessageData: data,
    };
    return JSON.stringify(msg);
}

export interface HimChangeCmdReq {
    BaseTime: string;
    TaskID: number;
    ChangeCommand: unknown;
    OldValue: unknown;
    NewValue: unknown;
    DataValue: unknown;
}

export function makeHimChangeCmdReq(taskID:number, changeCommand:number, oldValue:string = '', newValue:string = '', dataValue:string = '') {
    const data: HimChangeCmdReq = {
        BaseTime: currentTimeInMilliseconds(),
        TaskID: taskID,
        ChangeCommand: changeCommand,
        OldValue: oldValue,
        NewValue: newValue,
        DataValue: dataValue,
    };

    const msg: msg = {
        MessageID: MessageID.HimChangeCmdReq,
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface DCMAirShowerCmd {
    ZoneID: number;
    Power: boolean;
}

export function makeAirShowerCmd(zoneID: number, power: boolean) {
    const data: DCMAirShowerCmd = {
        ZoneID: zoneID,
        Power: power,
    };
    const msg: msg = {
        MessageID: MessageID.DcmAirShowerCmd,
        MessageData: data,
    };
    return JSON.stringify(msg);
}

export interface HimForceInstallCarrier {
    BaseTime: string;
    ZoneID: number;
    CarrierID: string;
}
export function makeHimForceInstallCarrier(zoneID: number, carrierID:string) {
    /** Web Notuse */
    const data: HimForceInstallCarrier = {
        BaseTime: currentTimeInMilliseconds(),
        ZoneID: zoneID,
        CarrierID: carrierID,
    };

    const msg: msg = {
        MessageID: MessageID.HimForceInstallCarrier,
        MessageData: data,
    };

    return JSON.stringify(msg);
}

interface TcmRoutePathUpdateReq {
    BaseTime: string;
    TaskID: number;
    transferInfo?: TransferInfo;
}

export function makeTcmRoutePathUpdateReq(taskID:number, zoneIDFrom:number, zoneIDTo:number, junctionZoneIDs:number) {
    const data : TcmRoutePathUpdateReq = {
        BaseTime: currentTimeInMilliseconds(),
        TaskID: taskID,
        transferInfo : {
            TaskID : -1,
            SourceZoneID : zoneIDFrom,
            DestZoneID : zoneIDTo,
            JunctionZoneIDs : junctionZoneIDs,
        }
    }

    const msg: msg = {
        MessageID: 'tcmRoutePathUpdateReq',
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface UimZoneStateChangeReq {
    BaseTime: string;
    ZoneID: number;
    NewState: number;
}

export function makeUimZoneStateChangeReq(zoneID:number, newState:number) {
    const data: UimZoneStateChangeReq = {
        BaseTime: currentTimeInMilliseconds(),
        ZoneID: zoneID,
        NewState: newState,
    };

    const msg: msg = {
        MessageID: MessageID.UimZoneStateChangeReq,
        MessageData: data,
    };

    return JSON.stringify(msg);
}
interface TcsAlarmClear {
    BaseTime: string;
    SerialNo: number;
    Time?: string;
    ResolvedBy: string;
}

export function makeTcsAlarmClear(serialNo:number) {
    const now = currentTimeInMilliseconds();
    const data: TcsAlarmClear = {
        BaseTime: now,
        SerialNo: serialNo,
        Time: now,
        ResolvedBy: 'UIM',
    };

    const msg: msg = {
        MessageID: 'tcsClearAlarm',
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface UimControlModule {
    BaseTime: string;
    Command: unknown;
    Module: unknown;
    ID: unknown;
}

export function makeMessageUimControlModule(command:unknown, module:unknown, id:unknown) {
    const data: UimControlModule = {
        BaseTime: currentTimeInMilliseconds(),
        Command: command,
        Module: module,
        ID: id,
    };

    const msg: msg = {
        MessageID: MessageID.UimControlModule,
        MessageData: data,
    };

    return JSON.stringify(msg);
}
export interface UimCarrierReInstall {
    BaseTime: string;
    TaskID: number;
}

export function makeMessageUimCarrierReInstall(taskID:number) {
    const data: UimCarrierReInstall = {
        BaseTime: currentTimeInMilliseconds(),
        TaskID: taskID,
    };

    const msg: msg = {
        MessageID: MessageID.UimCarrierReInstall,
        MessageData: data,
    };

    return JSON.stringify(msg);
}

interface UimCarrierRelocation {
    BaseTime: string;
    TaskID: number;
    OldZoneID: number;
    NewZoneID: number;
}

export function makeMessageUimCarrierRelocation(taskID:number, OldZoneID:number, NewZoneID:number) {
    const data: UimCarrierRelocation = {
        BaseTime: currentTimeInMilliseconds(),
        TaskID: taskID,
        OldZoneID,
        NewZoneID,
    };

    const msg: msg = {
        MessageID: 'uimCarrierRelocation',
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface UimEquipmentStateChangeReq {
    BaseTime: string;
    CommState: number;
    ControlState: number;
    HostID: number;
}

export function makeMessageUimEquipmentStateChangeReq(commState: number, controlState: number,selectedNetwork:number) {
    const data: UimEquipmentStateChangeReq = {
        BaseTime: currentTimeInMilliseconds(),
        CommState: commState,
        ControlState: controlState,
        HostID : selectedNetwork,
    };

    const msg: msg = {
        MessageID: MessageID.UimEquipmentStateChangeReq,
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface IUimZoneUserAttributes {
    ZoneID: number;
    BaseTime: string;
    AutoIOPort: number;
    DefaultOutputZoneID: number;
}

export function makeMessageUimZoneUserAttributes(autoIOPort: number, defaultOutputZoneID: number, zoneID: number) {
    const data: IUimZoneUserAttributes = {
        ZoneID: zoneID,
        BaseTime: currentTimeInMilliseconds(),
        AutoIOPort: autoIOPort,
        DefaultOutputZoneID: defaultOutputZoneID,
    };

    const msg: msg = {
        MessageID: MessageID.UimZoneUserAttributes,
        MessageData: { Object: data },
    };

    return JSON.stringify(msg);
}

interface ITcmChangeProfile {
    BaseTime: string;
    ZoneID: number;
    SpeedType: number;
    ProfileType: number;
    Value: number;
}

export function makeTcmChangeProfile(zoneID: number, speedtype: number, profiletype: number, value: number) {
    const data: ITcmChangeProfile = {
        BaseTime: currentTimeInMilliseconds(),
        ZoneID: zoneID,
        SpeedType: speedtype,
        ProfileType: profiletype,
        Value: value,
    };

    const msg: msg = {
        MessageID: 'tcmChangeProfile',
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface ITcsPerformanceMonitor {
    BaseTime: Date;
    TcmId: number;
    CpuUsage: number;
    MemTotal: number;
    MemUsage: number;
    MemUsagePercent: number;
}

export interface IUimConfigurationSet {
    Target: number;
    ID: number;
}

export function makeUimConfigurationSet(target: number, id: number) {
    const data: IUimConfigurationSet = {
        Target: target,
        ID: id,
    };

    const msg: msg = {
        MessageID: MessageID.UimConfigurationSet,
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface IUimZoneAirShowerAttributes {
    ZoneID: number;
    AirShowerUnitCount: number;
}

export function makeUimZoneAirShowerAttributes(zoneID: number, count: number) {
    const data: IUimZoneAirShowerAttributes = {
        ZoneID: zoneID,
        AirShowerUnitCount: count,
    };

    const msg: msg = {
        MessageID: MessageID.UimZoneAirShowerAttributes,
        MessageData: data,
    };

    return JSON.stringify(msg);
}

export interface IHimControlSignal {
    Buzzer: number;
}

export function makeHimControlSignal(onOff: number) {
    const data: IHimControlSignal = {
        Buzzer: onOff,
    };

    const msg: msg = {
        MessageID: MessageID.HimControlSignal,
        MessageData: data,
    };

    return JSON.stringify(msg);
}
