import { Service } from '../service';
import { Client } from './client';
import { ZoneRepo } from '../zone/zoneRepo';
import logger from '../libs/logger';

export async function initailizeRedisInfo(client:Client) {
    const zoneRepo = Service.Inst.ZoneRepo;

    client.send('guiRenderInfo', { useRealPostion: zoneRepo.useRealPostion });

    const jobs = [];
    if (client.ClientType === 2) {
        jobs.push(initializeTaskInfos(client));
        jobs.push(initializeZoneDynamicAttributes(client));
        jobs.push(initializeZoneOccupiedAttributes(client, zoneRepo));
    }
    jobs.push(initializeAlarms(client));
    jobs.push(initializeModuleState(client));
    jobs.push(initializeEquipmentState(client));
    jobs.push(initailizeTCMInfo(client));

    await Promise.all(jobs);

    client.send('initializedataSend', {});
}

const findKeys = async (pattern:string) : Promise<string[]> => {
    const keys: string[] = [];
    let cursor = '0';
    do {
        // SCAN 명령 실행
        const result: [string, string[]] = await Service.Inst.Redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = result[0];
        keys.push(...result[1]);
    } while (cursor !== '0');

    return keys;
}

const initializeTaskInfos = async (client:Client) => {
    const tranferInfos:unknown[] = [];

    const keys: string[] = await findKeys('TransferInfo:*[0-9]');
    await Promise.all(
        keys.map(async (key) => {
            const taskInfo = await Service.Inst.Redis.hmget(
                key,
                'Location',
                'From',
                'CarrierID',
                'State',
                'CommandID',
                'To',
                'Junctions',
                'InstalledTime',
            );
            tranferInfos.push(
                {
                    Object: {
                        TaskID: key.substring(13),
                        CarrierID: taskInfo[2],
                        ZoneIDFrom: taskInfo[1],
                        ZoneIDTo: taskInfo[5],
                        ZoneIDJunctions: taskInfo[6] ? [taskInfo[6]] : [],
                        State: taskInfo[3],
                        ZoneIDCurrent: taskInfo[0],
                        InstalledTime: taskInfo[7],
                    },
                },
            );
        }),
    );

    client.send('tcmTransferInfo', tranferInfos);
}

const initializeAlarms = async (client:Client) => {
    const alarms:unknown[] = [];

    const redis = Service.Inst.Redis;

    const activeAlarms = await redis.smembers('System:Alarm:ActiveAlarms');

    await Promise.all(
        activeAlarms.map(async (alarm: string) => {
            const alarmInfo = await redis.hmget(
                `System:Alarm:Record:${alarm}`,
                'SerialNo',
                'Code',
                'Location',
                'SetTime',
            );
            alarms.push({
                Object: {
                    SerialNo: alarmInfo[0] ? +alarmInfo[0] : 0,
                    AlarmCode: alarmInfo[1],
                    TaskID: '',
                    Location: alarmInfo[2],
                    Reason: '',
                    CommandID: '',
                    CarrierID: '',
                    Time: alarmInfo[3],
                },
            });
        }),
    );

    client.send('tcmAlarmSet', alarms);
};


const initializeZoneDynamicAttributes = async (client:Client) => {
    const zoneDynamicattr:unknown[] = [];

    const redis = Service.Inst.Redis;
    const keys: string[] = await findKeys('Zone:*[0-9]:DynamicAttributes');

    await Promise.all(
        keys.map(async (dynamicattr) => {
            const dynamicattrState = await redis.hmget(
                dynamicattr,
                'State',
                'MotorState',
                'E84State',
                'E84Sequence',
                'E84BitState',
                'AirShowerBitState',
            );

            zoneDynamicattr.push({
                Object: {
                    ZoneID: dynamicattr.substring(5, dynamicattr.indexOf(':DynamicAttributes')),
                    State: Number(dynamicattrState[0]) || 0,
                    PrevState: -1,
                    MotorState: Number(dynamicattrState[1]) || 0,
                    E84State: dynamicattrState[2],
                    E84Sequence: dynamicattrState[3],
                    E84BitState: dynamicattrState[4],
                    AirShowerBitState: dynamicattrState[5],
                },
            });
        }),
    );

    client.send('UpdateZoneState', zoneDynamicattr);
};


const initializeZoneOccupiedAttributes = async (client:Client, zoneRepo:ZoneRepo) => {
    const zoneOccupiedattr:unknown[] = [];

    const redis = Service.Inst.Redis;
    const keys = await findKeys('Zone:*[0-9]:DynamicAttributes');

    await Promise.all(
        keys.map(async (occupiedattr) => {
            const occupiedState = await redis.hmget(
                occupiedattr,
                'ReservedTaskID',
                'AlarmSerialNumber',
                'Occupied',
                'OccupiedSensor1',
                'OccupiedSensor2',
                'OccupiedSensor3',
                'OccupiedSensor4',
                'OccupiedSensor5',
                'OccupiedSensor6',
                'CurrentDirection',
            );

            zoneOccupiedattr.push({
                Object: {
                    ZoneID: occupiedattr.substring(5, occupiedattr.indexOf(':DynamicAttributes')),
                    ReservedTaskID: occupiedState[0] !== null ? occupiedState[0] : -1,
                    CurrentLevel: -1,
                    AlarmSerialNumber: occupiedState[1] !== null ? occupiedState[1] : -1,
                    Occupied: occupiedState[2] !== null ? occupiedState[2] : -1,
                    OccupiedSensor1: occupiedState[3] !== null ? occupiedState[3] : -1,
                    OccupiedSensor2: occupiedState[4] !== null ? occupiedState[4] : -1,
                    OccupiedSensor3: occupiedState[5] !== null ? occupiedState[5] : -1,
                    OccupiedSensor4: occupiedState[6] !== null ? occupiedState[6] : -1,
                    OccupiedSensor5: occupiedState[7] !== null ? occupiedState[7] : -1,
                    OccupiedSensor6: occupiedState[8] !== null ? occupiedState[8] : -1,
                    CurrentDirection:
                        occupiedState[9] !== null
                            ? occupiedState[9]
                            : zoneRepo.Data.get(+occupiedattr.substring(5, occupiedattr.indexOf(':DynamicAttributes')))?.RefDirection,
                },
            });
        }),
    );

    client.send('UpdateZoneOccupiedState', zoneOccupiedattr);
};

async function initializeModuleState(client:Client) {
    const redis = Service.Inst.Redis;
    {
        const Alive = await redis.hmget(`HIMInfo:Alive`, 'Alive');
        const data = {
            StateType: 'HIM',
            Alive: Alive[0] !== null ? Alive[0] : '0',
        }
        client.send('initialmodulestate', data);
    }

    {
        const Alive = await redis.hmget(`DCMInfo:Alive`, 'Alive');
        const data = {
            StateType: 'DCM',
            Alive: Alive[0] !== null ? Alive[0] : '0',
        }
        client.send('initialmodulestate', data);
    }

    {
        const keys = await findKeys('TCMInfo:*[0-9]');
        keys.sort((lht, rht) => {
            const lhtValue = +lht.split(':')[1];
            const rhtValue = +rht.split(':')[1];
            return lhtValue - rhtValue;
        });

        await Promise.all(
            keys.map(async (key: string) => {
                const TCMID = +`${key}`.split(':')[1];
                const Alive = await redis.hmget(`${key}:Alive`, 'Alive');
                const data = {
                    StateType: 'TCM',
                    ID: TCMID,
                    Alive: Alive[0] !== null ? Alive[0] : '0',
                }
                client.send('initialmodulestate', data);
            }),
        );
    }
}

const initializeEquipmentState = async (client : Client) => {
    const redis = Service.Inst.Redis;
    const equmentInfo = await redis.hgetall('System:EquipmentState');

    if (equmentInfo) {
        const data = {
            MCS1 : {
                CommState: equmentInfo.CommState,
                ControlState: equmentInfo.ControlState,
            },
            MCS2 :{
                CommState: equmentInfo.CommState2,
                ControlState: equmentInfo.ControlState2,
            },
            ProcessingState: equmentInfo.ProcessingState2 || '0'
        };
        client.send('himEquipmentStateInfo', data);
    }
};


async function initailizeTCMInfo(client:Client) {
    const redis = Service.Inst.Redis;
    try {
        const keys = await findKeys('TCMInfo:*[0-9]');
        await Promise.all(
            keys.map(async (key) => {
                const IPAddress = await redis.hget(key, 'IPAddress');
                const Version = await redis.hmget(`${key}:Version`, 'BuildNum', 'BuildDate');
                const data = {
                    TCMID: `${key}`.split(':')[1],
                    IPAddress: IPAddress,
                    BuildNum: Version[0],
                    BuildDate: Version[1],
                }
                client.send('TCMInfo', data);
            }),
        );
    } catch (ex) {
        logger.error(`initailizeTCMInfo. ex: ${ex}`);
    }
}
