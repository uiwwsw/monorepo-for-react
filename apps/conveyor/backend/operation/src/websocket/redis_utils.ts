import { Service } from '../service';
import WebSocket from 'ws';

export async function initailizeRedisInfo(client:WebSocket) {
    const zoneRepo = Service.Inst.ZoneRepo;

    client.send(JSON.stringify({ type: 'guiRenderInfo', data: JSON.stringify({ useRealPostion: zoneRepo.useRealPostion }) }));

    const jobs = [];
    jobs.push(initializeTaskInfos(client));

    await Promise.all(jobs);

    client.send(JSON.stringify({ type: 'initializedataSend', data: JSON.stringify({}) }));
}

const initializeTaskInfos = async (client:WebSocket) => {
    const tranferInfos:unknown[] = [];

    const keys: string[] = [];
    let cursor = '0';
    do {
        // SCAN 명령 실행
        const result: [string, string[]] = await Service.Inst.Redis.scan(cursor, 'MATCH', 'TransferInfo:*[0-9]', 'COUNT', 100);
        cursor = result[0];
        keys.push(...result[1]);
    } while (cursor !== '0');

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
                        ZoneIDJunctions: taskInfo[6],
                        State: taskInfo[3],
                        ZoneIDCurrent: taskInfo[0],
                        InstalledTime: taskInfo[7],
                    },
                },
            );
        }),
    );

    client.send(JSON.stringify({ type: 'tcmTransferInfo', data: JSON.stringify(tranferInfos) }));
}
